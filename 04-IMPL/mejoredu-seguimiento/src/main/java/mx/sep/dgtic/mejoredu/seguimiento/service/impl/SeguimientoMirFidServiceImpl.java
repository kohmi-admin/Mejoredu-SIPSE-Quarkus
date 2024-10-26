package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import io.quarkus.logging.Log;
import lombok.Getter;
import mx.edu.sep.dgtic.mejoredu.Enums.TiposProgramasPresupuestales;
import mx.edu.sep.dgtic.mejoredu.dao.repository.JustificacionIndicadorRepository;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.JustificacionActividadVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mir.SeguimientoJustificacionesMirDTO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.*;
import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.*;
import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionJustificacionActividadesVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionJustificacionIndicadorVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mir.SeguimientoMirDTO;
import mx.sep.dgtic.mejoredu.seguimiento.service.SeguimientoMirFidService;
import mx.sep.dgtic.mejoredu.seguimiento.util.MirUtil;

@Service
public class SeguimientoMirFidServiceImpl implements SeguimientoMirFidService {

  @Inject
  private VtSeguimientoMirRepository seguimientoMirRepository;
  @Inject
  private SeguimientoPresupuestalRepository seguimientoPresupuestalRepository;
  @Inject
  private SeguimientoIndicadorRepository seguimientoIndicadorRepository;
  @Inject
  private SeguimientoMetaRepository seguimientoMetaRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;
  @Inject
  private TipoDocumentoRepository tipoDocumentoRepository;
  @Inject
  private JustificacionRepository justificacionRepository;
  @Inject
  private JustificacionDocumentoRepository justificacionDocumentoRepository;
  @Inject
  private ArchivoRepository archivoRepository;
  @Inject
  private JustificacionProductoRepository justificacionProductoRepository;
  @Inject
  private ProgramaPresupuestalRepository programaPresupuestalRepository;
  @Inject
  private FichaIndicadoresRepository fichaIndicadoresRepository;
  @Inject
  private IndicadorProgramaRepository indicadorProgramaRepository;
  @Inject
  private MetValidacionRepository metValidacionRepository;
  @Inject
  private PresupuestalJustificacionRepository presupuestalJustificacionRepository;
  @Inject
  private MasterCatalogoRepository masterCatalogoRepository;
  @Inject
  private ProductoRepository productoRepository;
  @Inject
  private JustificacionIndicadorRepository justificacionIndicadorRepository;
  @Inject
  private IndicadorResultadoRepository indicadorResultadoRepository;

  private static final Integer ID_M001 = 799;
  private static final Integer ID_O001 = 797;

  @Override
  public List<SeguimientoMirDTO> consultaPorAnhio(Integer anhio) {

    var seguimiento = seguimientoMirRepository.list("idAnhio = ?1", anhio);

    // [id_indicador] [id_producto] [mes]
    // [programado]
    // Alcanzado acumulado, productos con entregables >= programados
    // Porcentaje acumulado, productos alcanzados / total productos

    var map = new HashMap<Integer, SeguimientoMirDTO>();
    var indicadorProductos = new HashMap<Integer, Map<Integer, ProductoEntregables>>();

    for (var it : seguimiento) {
      var mir = map.getOrDefault(it.getId().getIdIndicadorResultado(), new SeguimientoMirDTO());
      var productos = indicadorProductos.getOrDefault(it.getId().getIdIndicadorResultado(), new HashMap<>());

      var productoEntregables = productos.getOrDefault(it.getId().getIdProducto(), new ProductoEntregables());
      productoEntregables.addProgramado(it.getProgramado());
      productoEntregables.addEntregado(it.getEntregado());

      productos.put(it.getId().getIdProducto(), productoEntregables);

      mir.setIdIndicadorResultado(it.getId().getIdIndicadorResultado());
      mir.setNivel(it.getClave());
      mir.setIdCatalogoUnidad(it.getIdCatalogoUnidad());
      mir.setIndicador(it.getIndicador());

      switch (it.getId().getMes()) {
        case 1, 2, 3 -> {
          mir.getPrimero().setUnidad(it.getUnidadCorta());
          mir.getPrimero().addProgramado(it.getProgramado());
          mir.getPrimero().addReportado(it.getEntregado());
        }
        case 4, 5, 6 -> {
          mir.getSegundo().setUnidad(it.getUnidadCorta());
          mir.getSegundo().addProgramado(it.getProgramado());
          mir.getSegundo().addReportado(it.getEntregado());
        }
        case 7, 8, 9 -> {
          mir.getTercero().setUnidad(it.getUnidadCorta());
          mir.getTercero().addProgramado(it.getProgramado());
          mir.getTercero().addReportado(it.getEntregado());
        }
        case 10, 11, 12 -> {
          mir.getCuarto().setUnidad(it.getUnidadCorta());
          mir.getCuarto().addProgramado(it.getProgramado());
          mir.getCuarto().addReportado(it.getEntregado());
        }
      }

      map.put(it.getId().getIdIndicadorResultado(), mir);
      indicadorProductos.put(it.getId().getIdIndicadorResultado(), productos);
    }

    for (var it : map.values()) {
      var productos = indicadorProductos.get(it.getIdIndicadorResultado());
      var totalProgramadoPorIndicador = productos.values().stream().mapToInt(ProductoEntregables::getProgramado).sum();
      var totalReportadoPorIndicador = productos.values().stream().mapToInt(ProductoEntregables::getEntregado).sum();
      var productosAlcanzados = productos.values().stream().filter(ProductoEntregables::isAlcanzado).count();
      var porcentajeAlcanzado = (double) productosAlcanzados / productos.size();

      // Calcular porcentajes
      var primerPorcentajeProgramado = (double) it.getPrimero().getProgramado() / totalProgramadoPorIndicador;
      var primerPorcentajeReportado = (double) it.getPrimero().getReportado() / totalReportadoPorIndicador;

      // Transformar porcentaje a string ##.#
      it.getPrimero().setPorcentajeProgramado(round(primerPorcentajeProgramado * 100));
      it.getPrimero().setPorcentajeReportado(round(primerPorcentajeReportado * 100));

      var segundoPorcentajeProgramado = (double) it.getSegundo().getProgramado() / totalProgramadoPorIndicador;
      var segundoPorcentajeReportado = (double) it.getSegundo().getReportado() / totalReportadoPorIndicador;

      // Transformar porcentaje a string ##.#
      it.getSegundo().setPorcentajeProgramado(round(segundoPorcentajeProgramado * 100));
      it.getSegundo().setPorcentajeReportado(round(segundoPorcentajeReportado * 100));

      var terceroPorcentajeProgramado = (double) it.getTercero().getProgramado() / totalProgramadoPorIndicador;
      var terceroPorcentajeReportado = (double) it.getTercero().getReportado() / totalReportadoPorIndicador;

      // Transformar porcentaje a string ##.#
      it.getTercero().setPorcentajeProgramado(round(terceroPorcentajeProgramado * 100));
      it.getTercero().setPorcentajeReportado(round(terceroPorcentajeReportado * 100));

      var cuartoPorcentajeProgramado = (double) it.getCuarto().getProgramado() / totalProgramadoPorIndicador;
      var cuartoPorcentajeReportado = (double) it.getCuarto().getReportado() / totalReportadoPorIndicador;

      // Transformar porcentaje a string ##.#
      it.getCuarto().setPorcentajeProgramado(round(cuartoPorcentajeProgramado * 100));
      it.getCuarto().setPorcentajeReportado(round(cuartoPorcentajeReportado * 100));

      it.setAlcanzadoAcumulado((int) productosAlcanzados);
      it.setPorcentajeAcumulado(round(porcentajeAlcanzado * 100));
    }

    return map.values().stream().toList();
  }

  @Override
  public List<SeguimientoJustificacionesMirDTO> consultarJustificaciones(Integer anhio, Integer trimestre) {
    var justificaciones = justificacionRepository.list(
        "indicadorResultado.programaPresupuestal.idAnhio = ?1", anhio
    );

    var indicadores = indicadorResultadoRepository.list("""
        SELECT ir FROM IndicadorResultado ir
        INNER JOIN JustificacionProducto jp
          ON ir.masterCatalogo = jp.producto.indicadorMIR
        
        WHERE ir.programaPresupuestal.idAnhio = ?1
        AND jp.id.ixTrimestre = ?2
        """, anhio, trimestre);

    var totalJustificaciones = new ArrayList<SeguimientoJustificacionesMirDTO>();
    var setCveUsuario = justificaciones.stream().map(Justificacion::getIndicadorResultado)
        .map(IndicadorResultado::getProgramaPresupuestal)
        .map(ProgramaPresupuestal::getCveUsuario)
        .collect(Collectors.toSet());

    var perfilLaboral = perfilLaboralRepository.list("cveUsuario in ?1", setCveUsuario)
        .stream().collect(Collectors.toMap(PerfilLaboral::getCveUsuario, PerfilLaboral::getCatalogoUnidad));

    for (var justificacion : justificaciones) {
      var justificacionDTO = new SeguimientoJustificacionesMirDTO();

      justificacionDTO.setIdIndicadorResultado(justificacion.getIndicadorResultado().getIdIndicadorResultado());
      justificacionDTO.setNivel(justificacion.getIndicadorResultado().getCxClave());
      justificacionDTO.setIndicador(justificacion.getIndicadorResultado().getCxNombre());
      var idCatalogoUnidad = perfilLaboral.get(justificacion.getIndicadorResultado().getProgramaPresupuestal().getCveUsuario());
      justificacionDTO.setIdCatalogoUnidad(idCatalogoUnidad.getId());
      justificacionDTO.setUnidad(idCatalogoUnidad.getCcExternaDos());

      totalJustificaciones.add(justificacionDTO);
    }

    for(var indicador : indicadores){
      var justificacionDTO = new SeguimientoJustificacionesMirDTO();
      justificacionDTO.setIdIndicadorResultado(indicador.getIdIndicadorResultado());
      justificacionDTO.setNivel(indicador.getCxClave());
      justificacionDTO.setIndicador(indicador.getCxNombre());
      var idCatalogoUnidad = perfilLaboral.get(indicador.getProgramaPresupuestal().getCveUsuario());
      justificacionDTO.setIdCatalogoUnidad(idCatalogoUnidad.getId());
      justificacionDTO.setUnidad(idCatalogoUnidad.getCcExternaDos());

      totalJustificaciones.add(justificacionDTO);
    }

    return totalJustificaciones;
  }

  @Override
  public PeticionJustificacionIndicadorVO consultaJustificacionIndicador(Integer idIndicador) {
    Justificacion justificacion = justificacionRepository.findByIdIndicador(idIndicador)
        .orElseThrow(() -> new BadRequestException("Justificacion no encontrada"));

    List<JustificacionDocumento> documentos = justificacionDocumentoRepository
        .findByIdJustificacion(justificacion.getIdJustificacion());

    return MirUtil.convertJustificacion(justificacion, documentos);
  }

  @Override
  @Transactional
  public void registrarIndicador(PeticionJustificacionIndicadorVO peticion) {
    Usuario usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
    TipoDocumento tipoDocumento = tipoDocumentoRepository.findByExtension("pdf");

    var justificacion = justificacionRepository.findByIdIndicador(peticion.getIdIndicador())
        .orElse(new Justificacion());
    justificacion.setIdIndicador(peticion.getIdIndicador());
    justificacion.setIndicador(peticion.getIndicador());
    justificacion.setRegistroAvance(peticion.getAvance().toString());
    justificacion.setCausa(peticion.getCausa());
    justificacion.setEfecto(peticion.getEfecto());
    justificacion.setOtrosMotivos(peticion.getOtrosMotivos());

    justificacionRepository.persistAndFlush(justificacion);

    justificacionDocumentoRepository.delete("id.idJustificacion", justificacion.getIdJustificacion());
    peticion.getArchivos().forEach(archivoVO -> {
      var archivoPersisted = archivoRepository.find("uuid", archivoVO.getUuid()).firstResultOptional()
          .orElseGet(() -> {
            Archivo archivo = new Archivo();
            archivo.setEstatus("C");
            archivo.setNombre(archivoVO.getNombre());
            archivo.setUuid(archivoVO.getUuid());
            archivo.setFechaCarga(LocalDate.now());
            archivo.setHoraCarga(LocalTime.now());
            archivo.setTipoDocumento(tipoDocumento);
            archivo.setUsuario(usuario);

            return archivo;
          });

      archivoRepository.persistAndFlush(archivoPersisted);

      var justificacionDocumentoId = new JustificacionDocumentoPK();
      justificacionDocumentoId.setIdJustificacion(justificacion.getIdJustificacion());
      justificacionDocumentoId.setIdArchivo(archivoPersisted.getIdArchivo());

      var justificacionDocumento = new JustificacionDocumento();
      justificacionDocumento.setId(justificacionDocumentoId);

      justificacionDocumentoRepository.persistAndFlush(justificacionDocumento);
    });
  }

  @Override
  public PeticionJustificacionActividadesVO consultaJustificacionActividad(Integer idIndicador, Integer trimestre) {
    var productos = productoRepository.list("""
        SELECT p FROM Producto p
        LEFT JOIN IndicadorResultado ir
          ON p.indicadorMIR.id = ir.masterCatalogo.id
        LEFT JOIN FETCH p.justificacionProducto jp
        LEFT JOIN FETCH p.adecuacionProducto ap
        LEFT JOIN FETCH ap.adecuacionSolicitud ads
        LEFT JOIN FETCH ads.solicitud s
        WHERE ir.idIndicadorResultado = ?1
        """, idIndicador);

    var respuesta = new PeticionJustificacionActividadesVO();

    respuesta.setIdIndicador(idIndicador);
    respuesta.setTrimestre(trimestre);
    respuesta.setJustificaciones(productos.stream().map(producto -> {
      var defaultProducto = producto.getJustificacionProducto().stream()
          .filter(it -> it.getId().getIxTrimestre().equals(0))
          .findFirst();

      var justificacionProducto = defaultProducto.isEmpty()
          ? producto.getJustificacionProducto().stream().filter(it -> it.getId().getIxTrimestre().equals(trimestre)).findFirst()
          : defaultProducto;

      var justificacionAdecuacion = producto.getAdecuacionProducto().stream()
          .filter(it -> it.getAdecuacionSolicitud().getSolicitud().getEstatusCatalogo().getId() == 2243)
          .findFirst()
          .map(it -> it.getAdecuacionSolicitud().getSolicitud().getJustificacion())
          .orElse(null);

      return JustificacionActividadVO.builder()
          .idProducto(producto.getIdProducto())
          .cveProducto(producto.getCveProducto())
          .nombreProducto(producto.getCxNombre())
          .calendario(producto.getProductoCalendario().stream().map(calendario -> ProductoCalendarioVO.builder()
              .idProductoCalendario(calendario.getIdProductoCalendario())
              .idProducto(calendario.getIdProducto())
              .mes(calendario.getCiMes())
              .monto(calendario.getCiMonto())
              .build()).toList())
          .justificacion(justificacionAdecuacion)
          .causa(justificacionProducto.map(JustificacionProducto::getCausa).orElse(null))
          .efectos(justificacionProducto.map(JustificacionProducto::getEfectos).orElse(null))
          .otrosMotivos(justificacionProducto.map(JustificacionProducto::getOtrosMotivos).orElse(null))
          .build();
    }).toList());

    return respuesta;
  }

  @Override
  @Transactional
  public void registrarActividad(PeticionJustificacionActividadesVO peticion) {
    // Esta funcion debe registrar JustificacionProducto por trimestre
    usuarioRepository.findByIdOptional(peticion.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));

    var idProductos = peticion.getJustificaciones().stream().map(JustificacionActividadVO::getIdProducto).toList();
    var productos = productoRepository.find("idProducto in ?1", idProductos).list();
    var mapProductos = productos.stream().collect(Collectors.toMap(Producto::getIdProducto, Function.identity()));
    var idProductosPersisted = productos.stream().map(Producto::getIdProducto).toList();

    if (idProductos.size() != idProductosPersisted.size()) {
      var productosNoEncontrados = idProductos.stream().filter(id -> !idProductosPersisted.contains(id)).toList();

      throw new BadRequestException("No se encontraron los productos con los siguientes IDs: " + productosNoEncontrados);
    }

    for (var justificacion : peticion.getJustificaciones()) {
      var producto = mapProductos.get(justificacion.getIdProducto());

      var defaultProducto = producto.getJustificacionProducto().stream()
          .filter(it -> it.getId().getIxTrimestre().equals(0))
          .findFirst();

      if (defaultProducto.isEmpty()) {
        var justificacionProductoTrimestre = producto.getJustificacionProducto().stream()
            .filter(it -> it.getId().getIxTrimestre().equals(peticion.getTrimestre()))
            .findFirst()
            .orElseGet(() -> {
              var justificacionProductoPK = new JustificacionProductoPK();
              justificacionProductoPK.setIdProducto(justificacion.getIdProducto());
              justificacionProductoPK.setIxTrimestre(peticion.getTrimestre());
              var justificacionProducto = new JustificacionProducto();
              justificacionProducto.setId(justificacionProductoPK);

              return justificacionProducto;
            });

        justificacionProductoTrimestre.setCausa(justificacion.getCausa());
        justificacionProductoTrimestre.setEfectos(justificacion.getEfectos());
        justificacionProductoTrimestre.setOtrosMotivos(justificacion.getOtrosMotivos());

        justificacionProductoRepository.persistAndFlush(justificacionProductoTrimestre);
      }

    }
  }

  @Override
  public ConsultaSeguimientoMirFidVO consultarSeguimientoMirFid(Integer anhio, Integer semestre, String cveUsuario, TiposProgramasPresupuestales tipoPrograma) {
    var idTipoPrograma = switch (tipoPrograma) {
      case M001 -> ID_M001;
      case O001 -> ID_O001;
      default -> throw new BadRequestException("Tipo de programa no soportado");
    };

    var usuario = usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(usuario.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Perfil laboral no encontrado"));

    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(anhio, idTipoPrograma)
        .orElseThrow(() -> new BadRequestException("Programa presupuestal no encontrado"));
    var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal())
        .orElseThrow(() -> new BadRequestException("Indicador de programa no encontrado"));
    Log.info("Indicador de programa encontrado: " + indicadorPrograma.getIdRamoSector());
//		var ramo = masterCatalogoRepository.findByIdOptional(indicadorPrograma.getIdRamoSector())
//				.orElseThrow(() -> new BadRequestException("Ramo no encontrado"));

    var seguimientoPresupuestoPK = new SeguimientoPresupuestalPK(
        programa.getIdPresupuestal(),
        semestre,
        perfilLaboral.getIdCatalogoUnidad()
    );

    Log.info("Seguimiento presupuestal encontrado: " + seguimientoPresupuestoPK);

    var seguimientoPresupuesto = seguimientoPresupuestalRepository.findByIdOptional(seguimientoPresupuestoPK);

    var vo = new ConsultaSeguimientoMirFidVO();
    var programaPresupuestal = new IdentificacionProgramaPresupuestarioVO();
    programaPresupuestal.setIdUnidad(perfilLaboral.getIdCatalogoUnidad());
    programaPresupuestal.setClaveUnidad(perfilLaboral.getCatalogoUnidad().getCcExterna());
    programaPresupuestal.setNombreUnidad(perfilLaboral.getCatalogoUnidad().getCdOpcion());
//		programaPresupuestal.setIdRamo(ramo.getId());
    programaPresupuestal.setRamo("47 Entidades no Sectorizadas");
    programaPresupuestal.setIdProgramaPresupuestario(programa.getIdPresupuestal());
    programaPresupuestal.setNombreProgramaPresupuestario(indicadorPrograma.getCxNombrePrograma());

    vo.setPrograma(programaPresupuestal);
    if (seguimientoPresupuesto.isEmpty()) {
      vo.setIndicador(new IdentificacionIndicadorVO());
      vo.setCiclo(new CicloPresupuestarioVO());
      vo.setCicloAjustado(new CicloPresupuestarioAjustadoVO());
      vo.setOtrasMetas(new MetaCicloVO());
      vo.setOtrasMetasCicloAjustado(new CicloPresupuestarioAjustadoBaseVO());
      return vo;
    }

    if (seguimientoPresupuesto.get().getSeguimientoIndicador() != null) {
      vo.setIndicador(seguimientoPresupuesto.get().getSeguimientoIndicador().toVO());
    } else {
      vo.setIndicador(new IdentificacionIndicadorVO());
    }

    if (seguimientoPresupuesto.get().getCicloPresupuestario() != null) {
      vo.setCiclo(seguimientoPresupuesto.get().getCicloPresupuestario().toCicloPresupuestario());
    } else {
      vo.setCiclo(new CicloPresupuestarioVO());
    }

    if (seguimientoPresupuesto.get().getCicloPresupuestarioAjustado() != null) {
      vo.setCicloAjustado(seguimientoPresupuesto.get().getCicloPresupuestarioAjustado().toCicloPresupuestarioAjustado());
    } else {
      vo.setCicloAjustado(new CicloPresupuestarioAjustadoVO());
    }

    Log.info("Otra meta: " + seguimientoPresupuesto.get().getOtraMeta());
    if (seguimientoPresupuesto.get().getOtraMeta() != null) {
      vo.setOtrasMetas(seguimientoPresupuesto.get().getOtraMeta().toMetaCiclo());
    } else {
      vo.setOtrasMetas(new MetaCicloVO());
    }

    Log.info("Otra meta ajustada: " + seguimientoPresupuesto.get().getOtraMetaAjustada());
    if (seguimientoPresupuesto.get().getOtraMetaAjustada() != null) {
      vo.setOtrasMetasCicloAjustado(seguimientoPresupuesto.get().getOtraMetaAjustada().toMetaCicloAjustado());
    } else {
      vo.setOtrasMetasCicloAjustado(new CicloPresupuestarioAjustadoBaseVO());
    }

    return vo;
  }

  @Override
  public List<ConsultaSeguimientoMirFidVO> consultarVariosSeguimientoMirFid(Integer anhio, Integer semestre, String cveUsuario, TiposProgramasPresupuestales tipoPrograma) {
    var idTipoPrograma = switch (tipoPrograma) {
      case M001 -> ID_M001;
      case O001 -> ID_O001;
      default -> throw new BadRequestException("Tipo de programa no soportado");
    };

    var usuario = usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(usuario.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Perfil laboral no encontrado"));

    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(anhio, idTipoPrograma)
        .orElseThrow(() -> new BadRequestException("Programa presupuestal no encontrado"));
    var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal())
        .orElseThrow(() -> new BadRequestException("Indicador de programa no encontrado"));

    var seguimientos = usuario.hasReadAccess()
        ? seguimientoPresupuestalRepository.list(
        "id.idPresupuestal = ?1 and id.ixSemestre = ?2",
        programa.getIdPresupuestal(), semestre)
        : seguimientoPresupuestalRepository.list(
        "id.idPresupuestal = ?1 and id.ixSemestre = ?2 and id.idUnidad = ?3",
        programa.getIdPresupuestal(), semestre, perfilLaboral.getIdCatalogoUnidad());

    return seguimientos.stream().map(it -> {
      var vo = new ConsultaSeguimientoMirFidVO();

      var programaPresupuestal = new IdentificacionProgramaPresupuestarioVO();
      programaPresupuestal.setIdUnidad(perfilLaboral.getIdCatalogoUnidad());
      programaPresupuestal.setClaveUnidad(perfilLaboral.getCatalogoUnidad().getCcExterna());
      programaPresupuestal.setNombreUnidad(perfilLaboral.getCatalogoUnidad().getCdOpcion());
      // programaPresupuestal.setIdRamo(ramo.getId());
      programaPresupuestal.setRamo("47 Entidades no Sectorizadas");
      programaPresupuestal.setIdProgramaPresupuestario(programa.getIdPresupuestal());
      programaPresupuestal.setNombreProgramaPresupuestario(indicadorPrograma.getCxNombrePrograma());

      vo.setPrograma(programaPresupuestal);
      if (it.getSeguimientoIndicador() != null) {
        vo.setIndicador(it.getSeguimientoIndicador().toVO());
      } else {
        vo.setIndicador(new IdentificacionIndicadorVO());
      }

      if (it.getCicloPresupuestario() != null) {
        vo.setCiclo(it.getCicloPresupuestario().toCicloPresupuestario());
      } else {
        vo.setCiclo(new CicloPresupuestarioVO());
      }

      if (it.getCicloPresupuestarioAjustado() != null) {
        vo.setCicloAjustado(it.getCicloPresupuestarioAjustado().toCicloPresupuestarioAjustado());
      } else {
        vo.setCicloAjustado(new CicloPresupuestarioAjustadoVO());
      }
      if (it.getOtraMeta() != null) {
        vo.setOtrasMetas(it.getOtraMeta().toMetaCiclo());
      } else {
        vo.setOtrasMetas(new MetaCicloVO());
      }
      if (it.getOtraMetaAjustada() != null) {
        vo.setOtrasMetasCicloAjustado(it.getOtraMetaAjustada().toMetaCicloAjustado());
      } else {
        vo.setOtrasMetasCicloAjustado(new CicloPresupuestarioAjustadoBaseVO());
      }

      return vo;
    }).toList();
  }

  @Override
  @Transactional
  public void registrarSeguimientoMirFid(RegistroSeguimientoMirFidVO peticion, TiposProgramasPresupuestales tipoPrograma) {
    var idTipoPrograma = switch (tipoPrograma) {
      case M001 -> ID_M001;
      case O001 -> ID_O001;
      default -> throw new BadRequestException("Tipo de programa no soportado");
    };

    Log.info("Registrando seguimiento para el programa presupuestal " + idTipoPrograma);

    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(usuario.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Perfil laboral no encontrado"));

    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(peticion.getIdAnhio(), idTipoPrograma)
        .orElseThrow(() -> new BadRequestException("Programa presupuestal no encontrado"));
    var indicadorPrograma = indicadorProgramaRepository.findByIdProgramaPresupuestal(programa.getIdPresupuestal())
        .orElseThrow(() -> new BadRequestException("Indicador de programa no encontrado"));

    Log.info("Validacion de metas para el programa presupuestal " + idTipoPrograma);

    var seguimientoPresupuestoPK = new SeguimientoPresupuestalPK(
        indicadorPrograma.getIdPresupuestal(),
        peticion.getPeriodo(),
        perfilLaboral.getIdCatalogoUnidad()
    );

    Log.info("Registrando seguimiento para el programa presupuestal " + seguimientoPresupuestoPK);

    var seguimientoPresupuesto = seguimientoPresupuestalRepository.findByIdOptional(seguimientoPresupuestoPK)
        .orElseGet(SeguimientoPresupuestal::new);

    seguimientoPresupuesto.setId(seguimientoPresupuestoPK);

    var identificador = getSeguimientoIndicador(peticion, seguimientoPresupuesto);
    seguimientoIndicadorRepository.persist(identificador);
    seguimientoPresupuesto.setSeguimientoIndicador(identificador);

    var cicloPresupuestario = getSeguimientoMetaFromCicloPresupuestario(peticion.getCiclo(), seguimientoPresupuesto);
    cicloPresupuestario.setIxTipoMeta(0);
    seguimientoMetaRepository.persist(cicloPresupuestario);
    seguimientoPresupuesto.setCicloPresupuestario(cicloPresupuestario);

    var cicloPresuestarioAjustado = getSeguimientoMetaFromCicloPresupuestarioAjustado(peticion.getCicloAjustado(), seguimientoPresupuesto);
    cicloPresuestarioAjustado.setIxTipoMeta(1);
    seguimientoMetaRepository.persist(cicloPresuestarioAjustado);
    seguimientoPresupuesto.setCicloPresupuestarioAjustado(cicloPresuestarioAjustado);

    seguimientoPresupuestalRepository.persist(seguimientoPresupuesto);

    Log.info("Programa presupuestal " + seguimientoPresupuestoPK + " registrado exitosamente");
  }

  @Override
  @Transactional
  public void registrarOtrasMetasSeguimiento(RegistroOtrasMetasSeguimientoVO peticion, TiposProgramasPresupuestales tipoPrograma) {
    var idTipoPrograma = switch (tipoPrograma) {
      case M001 -> ID_M001;
      case O001 -> ID_O001;
      default -> throw new BadRequestException("Tipo de programa no soportado");
    };

    Log.info("Registrando seguimiento para el programa presupuestal " + idTipoPrograma);

    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(usuario.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Perfil laboral no encontrado"));

    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(peticion.getIdAnhio(), idTipoPrograma)
        .orElseThrow(() -> new BadRequestException("Programa presupuestal no encontrado"));

    Log.info("Validacion de metas para el programa presupuestal " + idTipoPrograma);

    var seguimientoPresupuestoPK = new SeguimientoPresupuestalPK(
        programa.getIdPresupuestal(),
        peticion.getPeriodo(),
        perfilLaboral.getIdCatalogoUnidad()
    );

    Log.info("Registrando seguimiento para el programa presupuestal " + seguimientoPresupuestoPK);

    var seguimientoPresupuesto = seguimientoPresupuestalRepository.findByIdOptional(seguimientoPresupuestoPK)
        .orElseGet(SeguimientoPresupuestal::new);

    seguimientoPresupuesto.setId(seguimientoPresupuestoPK);

    var otraMeta = getSeguimientoMetaFromMetaCiclo(peticion.getOtrasMetas(), seguimientoPresupuesto);
    otraMeta.setIxTipoMeta(2);
    seguimientoMetaRepository.persistAndFlush(otraMeta);
    seguimientoPresupuesto.setOtraMeta(otraMeta);

    var otraMetaAjustada = getSeguimientoMetaFromCicloPresupuestarioAjustadoBase(peticion.getCicloAjustado(), seguimientoPresupuesto);
    otraMetaAjustada.setIxTipoMeta(3);
    seguimientoMetaRepository.persistAndFlush(otraMetaAjustada);
    seguimientoPresupuesto.setOtraMetaAjustada(otraMetaAjustada);

    seguimientoPresupuestalRepository.persistAndFlush(seguimientoPresupuesto);
  }

  private static SeguimientoMeta getSeguimientoMetaFromCicloPresupuestarioAjustado(CicloPresupuestarioAjustadoVO peticion, SeguimientoPresupuestal seguimientoPresupuestal) {
    var cicloPresupuestario = seguimientoPresupuestal.getCicloPresupuestarioAjustado() == null
        ? new SeguimientoMeta()
        : seguimientoPresupuestal.getCicloPresupuestarioAjustado();

    cicloPresupuestario.setCxMetaEsperada(peticion.getMeta());
    cicloPresupuestario.setCxNumerador(peticion.getNumerador());
    cicloPresupuestario.setCxDenominador(peticion.getDenominador());
    cicloPresupuestario.setCxIndicador(peticion.getIndicador());

    cicloPresupuestario.setCxTipoAjuste(peticion.getTipoAjuste());
    cicloPresupuestario.setCxJustificacionCausas(peticion.getCausas());
    cicloPresupuestario.setCxJustificacionMotivos(peticion.getEfectos());
    cicloPresupuestario.setCxJustificacionOtros(peticion.getOtrosMotivos());
    return cicloPresupuestario;
  }

  private static SeguimientoMeta getSeguimientoMetaFromCicloPresupuestario(CicloPresupuestarioVO peticion, SeguimientoPresupuestal seguimientoPresupuestal) {
    var cicloPresupuestario = seguimientoPresupuestal.getCicloPresupuestario() == null
        ? new SeguimientoMeta()
        : seguimientoPresupuestal.getCicloPresupuestario();

    cicloPresupuestario.setCxMetaEsperada(peticion.getMeta());
    cicloPresupuestario.setCxNumerador(peticion.getNumerador());
    cicloPresupuestario.setCxDenominador(peticion.getDenominador());
    cicloPresupuestario.setCxIndicador(peticion.getIndicador());
    return cicloPresupuestario;
  }

  private static SeguimientoMeta getSeguimientoMetaFromMetaCiclo(MetaCicloVO peticion, SeguimientoPresupuestal seguimientoPresupuestal) {
    var cicloPresupuestario = seguimientoPresupuestal.getOtraMeta() == null
        ? new SeguimientoMeta()
        : seguimientoPresupuestal.getOtraMeta();

    cicloPresupuestario.setCxMetaEsperada(peticion.getMeta());
    cicloPresupuestario.setCxNumerador(peticion.getNumerador());
    cicloPresupuestario.setCxIndicador(peticion.getIndicador());
    return cicloPresupuestario;
  }

  private static SeguimientoMeta getSeguimientoMetaFromCicloPresupuestarioAjustadoBase(CicloPresupuestarioAjustadoBaseVO peticion, SeguimientoPresupuestal seguimientoPresupuestal) {
    var cicloPresupuestario = seguimientoPresupuestal.getOtraMetaAjustada() == null
        ? new SeguimientoMeta()
        : seguimientoPresupuestal.getOtraMetaAjustada();

    cicloPresupuestario.setCxMetaEsperada(peticion.getMeta());
    cicloPresupuestario.setCxNumerador(peticion.getNumerador());
    cicloPresupuestario.setCxIndicador(peticion.getIndicador());

    cicloPresupuestario.setCxTipoAjuste(peticion.getTipoAjuste());
    cicloPresupuestario.setCxJustificacionCausas(peticion.getCausas());
    cicloPresupuestario.setCxJustificacionMotivos(peticion.getEfectos());
    cicloPresupuestario.setCxJustificacionOtros(peticion.getOtrosMotivos());
    return cicloPresupuestario;
  }

  private static SeguimientoIndicador getSeguimientoIndicador(RegistroSeguimientoMirFidVO peticion, SeguimientoPresupuestal seguimientoPresupuestal) {
    var identificador = seguimientoPresupuestal.getSeguimientoIndicador() == null
        ? new SeguimientoIndicador()
        : seguimientoPresupuestal.getSeguimientoIndicador();

    identificador.setCxNombre(peticion.getIndicador().getNombre());
    identificador.setCxDefinicion(peticion.getIndicador().getDefinicion());
    identificador.setIxTipoMeta(peticion.getIndicador().getIxTipoValorMeta());
    identificador.setCxIndicadorPef(peticion.getIndicador().getIndicadorPEF());
    identificador.setIxTipoFormula(peticion.getIndicador().getIxTipoFormula());
    identificador.setCxTipoFormulaOtro(peticion.getIndicador().getTipoFormula());
    identificador.setIxEstatus(peticion.getIndicador().getIxEstatusAvance());
    return identificador;
  }

  @Getter
  private static class ProductoEntregables {
    private Integer programado = 0;
    private Integer entregado = 0;

    public void addProgramado(Integer programado) {
      this.programado += programado;
    }

    public void addEntregado(Integer entregado) {
      this.entregado += entregado;
    }

    public boolean isAlcanzado() {
      return entregado >= programado;
    }
  }

  private static Double round(double value) {
    int scale = (int) Math.pow(10, 1);
    var rounded = (double) Math.round(value * scale) / scale;

    Log.info("Rounded value: " + rounded);

    return (rounded);
  }
}