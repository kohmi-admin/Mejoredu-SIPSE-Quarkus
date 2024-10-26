package mx.mejoredu.dgtic.servicios.Impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;
import mx.edu.sep.dgtic.mejoredu.seguimiento.*;
import mx.mejoredu.dgtic.entity.*;
import org.springframework.stereotype.Service;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.mejoredu.dgtic.dao.ArchivoRepository;
import mx.mejoredu.dgtic.dao.AvanceRepository;
import mx.mejoredu.dgtic.dao.CortoplazoActividadRepository;
import mx.mejoredu.dgtic.dao.EvidenciaDocumentoRepository;
import mx.mejoredu.dgtic.dao.EvidenciaMensualRepository;
import mx.mejoredu.dgtic.dao.EvidenciaTrimestralRepository;
import mx.mejoredu.dgtic.dao.MetasVencidasAdelantadas;
import mx.mejoredu.dgtic.dao.ProductoCalendarioRepository;
import mx.mejoredu.dgtic.dao.ProductoRepository;
import mx.mejoredu.dgtic.dao.ProyectoAnualRepository;
import mx.mejoredu.dgtic.dao.TipoDocumentoRepository;
import mx.mejoredu.dgtic.dao.UsuarioRepository;
import mx.mejoredu.dgtic.servicios.AvanceProgmaticoService;

@Service
public class AvanceProgmaticoServiceImpl implements AvanceProgmaticoService {
  @Inject
  private ArchivoRepository archivoRepository;

  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private ProductoCalendarioRepository productoCalendarioRepository;
  @Inject
  private CortoplazoActividadRepository actividadRepository;
  @Inject
  private ProductoRepository productoRepository;
  @Inject
  private ProyectoAnualRepository proyectoAnualRepository;
  @Inject
  private AvanceRepository avanceRepository;
  @Inject
  private EvidenciaMensualRepository mensualRepository;
  @Inject
  private EvidenciaTrimestralRepository trimestralRepository;
  @Inject
  private EvidenciaDocumentoRepository documentoRepository;
  @Inject
  private TipoDocumentoRepository tipoDocumentoRepository;

  @Override
  public List<RespuestaAvancesProgramaticosVO> consultarAvances(int anhio) {
    var avances = avanceRepository.list("""
          	SELECT a FROM Avance a
        		LEFT JOIN a.productoCalendario pc
        		LEFT JOIN pc.producto p
        		LEFT JOIN p.actividad act
        		LEFT JOIN act.proyecto pro
        		LEFT JOIN pro.anhoPlaneacion anh
        		LEFT JOIN a.cortoplazoActividad cpa
        		LEFT JOIN cpa.proyecto pro2
        		LEFT JOIN pro2.anhoPlaneacion anh2
        		WHERE
        		  anh.idAnhio = ?1
        		  OR anh2.idAnhio = ?1
        """, anhio);

    Log.info("Avances: " + avances);

    return avances.stream().map(Avance::toRespuestaAvancesProgramaticosVO).toList();
  }

  @Override
  @Transactional
  public void eliminarAvance(int idAvance) {
    var avance = avanceRepository.findByIdOptional(idAvance)
        .orElseThrow(() -> new NotFoundException("No existe el avance con el id " + idAvance));

    var productoEntregado = avance.getProductoCalendarioEntregado() != null
        ? avance.getProductoCalendarioEntregado()
        : avance.getProductoCalendario();

    if (Objects.nonNull(productoEntregado)) {
      productoEntregado.setCiEntregados(0);
      productoCalendarioRepository.persist(productoEntregado);
    }

    avanceRepository.delete(avance);
  }

  @Override
  @Transactional
  public AvanceProgmatico registrarEntregables(AvanceProgmatico avanceProgmatico) {
    var producto = productoRepository.findByIdOptional(avanceProgmatico.getIdProducto())
        .orElseThrow(() -> new NotFoundException("No existe el producto"));
    List<ProductoCalendario> calendarioList = productoCalendarioRepository
        .find("idProducto = ?1", producto.getIdProducto()).list();

    var productosProgramados = avanceProgmatico.getProductosProgramados();
    // Transform the list of CalendarioProductosProgramadosVO to a HashMap with the
    // month as key
    var productosProgramadosMap = productosProgramados.stream()
        .collect(Collectors.toMap(CalendarioProductosProgramadosVO::getMes, Function.identity()));

    if (calendarioList.isEmpty()) {
      throw new BadRequestException("No existen entregables para el producto");
    }

    for (ProductoCalendario productoCalendario : calendarioList) {
      var productoProgramado = productosProgramadosMap.get(productoCalendario.getCiMes());
      if (Objects.nonNull(productoProgramado)) {
        // Debería creaer la entidad Avance y persistirla?
        productoCalendarioRepository.update("ciEntregados = ?1 WHERE ciMes = ?2 and idProducto = ?3",
            productoProgramado.getProductosEntregados(), productoCalendario.getCiMes(),
            productoCalendario.getIdProducto());
      }
    }

    return avanceProgmatico;
  }

  @Override
  public AvanceProgmatico consultarEntregables(int idProducto) {
    AvanceProgmatico avanceProgmatico = new AvanceProgmatico();

    List<ProductoCalendario> calendarioProductos = productoCalendarioRepository
        .consultaProductoCalendarioPorTrimestre(idProducto);
    Log.debug(calendarioProductos);
    var calendarioProgramados = calendarioProductos.stream()
        .map(productoCalendario -> new CalendarioProductosProgramadosVO(productoCalendario.getCiMes(),
            productoCalendario.getCiMonto(), productoCalendario.getCiEntregados()))
        .toList();

    avanceProgmatico.setProductosProgramados(calendarioProgramados);
    var producto = productoRepository.consultaProductoPorId(idProducto)
        .orElseThrow(() -> new NotFoundException("No existe el producto con el id " + idProducto));
    var actividad = producto.getActividad();
    var proyecto = actividad.getProyecto();
    avanceProgmatico.setCveProyecto(proyecto.getCveProyecto() + ". " + proyecto.getCxNombreProyecto());
    avanceProgmatico.setCveProducto(producto.getCveProducto() + producto.getCxNombre());
    avanceProgmatico.setCveActividad(actividad.getCveActividad() + ". " + actividad.getCxNombreActividad());

    return avanceProgmatico;
  }

  @Override
  @Transactional
  public RespuestaEvidenciaTrimestralVO registrarEvidenciaTrimestral(
      RegistroEvidenciaTrimestralVO evidenciaTrimestralVO, String cveUsuario) {
    usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No existe el usuario con clave " + cveUsuario));
    var mes = evidenciaTrimestralVO.getTrimestre() * 3;
    var productoCalendario = productoCalendarioRepository
        .find("idProducto = ?1 and ciMes = ?2", evidenciaTrimestralVO.getIdProducto(), mes)
        .firstResultOptional().orElseThrow(() -> new NotFoundException(
            "No existe el producto con id " + evidenciaTrimestralVO.getIdProducto() + " y mes " + mes));
    var evidenciaTrimestral = trimestralRepository
        .findByIdProductoAndMes(evidenciaTrimestralVO.getIdProducto(), mes).orElseGet(EvidenciaTrimestral::new);

    evidenciaTrimestral.setMetaSuperada(evidenciaTrimestralVO.getMetaSuperada());
    evidenciaTrimestral.setDificultadesSuperacion(evidenciaTrimestralVO.getDificultad());

    if (evidenciaTrimestralVO.getRevisado()) {
      evidenciaTrimestral.setFechaSesion(evidenciaTrimestralVO.getFechaSesion());
      evidenciaTrimestral.setAprobacionJuntaDirectiva(evidenciaTrimestralVO.getAprobado());
      evidenciaTrimestral.setFechaAprobacion(evidenciaTrimestralVO.getFechaAprobacion());
    }

    if (evidenciaTrimestralVO.getPublicacion()) {
      evidenciaTrimestral.setIdTipoPublicacion((evidenciaTrimestralVO.getTipoPublicacion()));
      evidenciaTrimestral.setEspecificarPublicacion(evidenciaTrimestralVO.getEspecificarPublicacion());
    }

    if (evidenciaTrimestralVO.getDifusion()) {
      evidenciaTrimestral.setIdTipoDifusion((evidenciaTrimestralVO.getTipoDifusion()));
      evidenciaTrimestral.setEspecificarDifusion(evidenciaTrimestralVO.getEspecificarDifusion());
    }

    trimestralRepository.persistAndFlush(evidenciaTrimestral);
    var idAvance = 0;
    // evidenciaMensual.getAvance().setEvidenciaMensual(evidenciaMensual);
    if (evidenciaTrimestral.getAvance() == null) {
      var avance = new Avance();
      avance.setIxTipoRegistro(0);
      avance.setProductoCalendario(productoCalendario);
      avance.setEvidenciaTrimestral(evidenciaTrimestral);
      avance.setCveUsuario(cveUsuario);
      avanceRepository.persistAndFlush(avance);
      idAvance = avance.getIdAvance();
    } else {
      idAvance = evidenciaTrimestral.getAvance().getIdAvance();
    }

    var respuesta = new RespuestaEvidenciaTrimestralVO();
    respuesta.setIdAvance(idAvance);
    respuesta.setIdEvidenciaTrimestral(evidenciaTrimestral.getIdEvidenciaTrimestral());

    return respuesta;
  }

  @Override
  @Transactional
  public RespuestaEvidenciaMensualVO registrarEvidenciasMensual(RegistroEvidenciaMensualVO peticion, String cveUsuario) {
    usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No existe el usuario con clave " + cveUsuario));
    var productoCalendario = productoCalendarioRepository
        .find("idProducto = ?1 and ciMes = ?2", peticion.getIdProducto(), peticion.getMes())
        .firstResultOptional().orElseThrow(() -> new NotFoundException(
            "No existe el producto con id " + peticion.getIdProducto() + " y mes " + peticion.getMes()));
    var evidenciaMensual = mensualRepository.findByIdProductoAndMes(peticion.getIdProducto(), peticion.getMes())
        .orElseGet(EvidenciaMensual::new);

    TipoDocumento tipoDocumento = tipoDocumentoRepository.findByExtension("pdf");
    Usuario usuario = usuarioRepository.findById(cveUsuario);

    evidenciaMensual.setEstatus(EstatusEnum.COMPLETO.getEstatus());
    evidenciaMensual.setJustificacion(peticion.getJustificacion());
    evidenciaMensual.setDescripcionTareas(peticion.getDescripcionTareas());
    evidenciaMensual.setDescripcionProducto(peticion.getDescripcionProducto());
    mensualRepository.persistAndFlush(evidenciaMensual);
    var idAvance = 0;
    // evidenciaMensual.getAvance().setEvidenciaMensual(evidenciaMensual);
    if (evidenciaMensual.getAvance() == null) {
      var avance = new Avance();
      avance.setIxTipoRegistro(0);
      avance.setEvidenciaMensual(evidenciaMensual);
      avance.setProductoCalendario(productoCalendario);
      avance.setCveUsuario(cveUsuario);

      avanceRepository.persistAndFlush(avance);
      idAvance = avance.getIdAvance();
    } else {
      idAvance = evidenciaMensual.getAvance().getIdAvance();
    }

    documentoRepository.delete("id.idEvidenciaMensual = ?1", evidenciaMensual.getIdEvidenciaMensual());

    for (var a : peticion.getArchivos()) {
      var archivoPersisted = archivoRepository.find("uuid", a.getUuid()).firstResultOptional()
          .orElseGet(() -> {
            Archivo archivo = new Archivo();
            archivo.setEstatus("C");
            archivo.setNombre(a.getNombre());
            archivo.setUuid(a.getUuid());
            archivo.setFechaCarga(LocalDate.now());
            archivo.setHoraCarga(LocalTime.now());
            archivo.setTipoDocumento(tipoDocumento);
            archivo.setUsuario(usuario);

            return archivo;
          });

      archivoRepository.persistAndFlush(archivoPersisted);

      EvidenciaDocumento evidenciaDocumento = new EvidenciaDocumento();
      EvidenciaDocumentoPK evidenciaDocumentoPK = new EvidenciaDocumentoPK();
      evidenciaDocumentoPK.setIdEvidenciaMensual(evidenciaMensual.getIdEvidenciaMensual());
      evidenciaDocumentoPK.setIdArchivo(archivoPersisted.getIdArchivo());
      evidenciaDocumento.setId(evidenciaDocumentoPK);
      documentoRepository.persistAndFlush(evidenciaDocumento);
    }

    var respuesta = new RespuestaEvidenciaMensualVO();
    respuesta.setIdAvance(idAvance);
    respuesta.setIdEvidenciaMensual(evidenciaMensual.getIdEvidenciaMensual());

    return respuesta;
  }


  @Override
  public EvidenciaTrimestralVO consultarEvidenciaTrimestral(int idProducto, int trimestre) {
    var mes = trimestre * 3;
    var evidencia = trimestralRepository.findByIdProductoAndMes(idProducto, mes)
        .orElseThrow(() -> new NotFoundException("No existe la evidencia trimestral para el producto "
            + idProducto + " y trimestre " + trimestre));

    var evidenciaTrimestral = new EvidenciaTrimestralVO();
    // evidenciaTrimestral.setIndicadorMIR();
    evidenciaTrimestral.setMetaSuperada(evidencia.getMetaSuperada());
    evidenciaTrimestral.setDificultad(evidencia.getDificultadesSuperacion());

    if (evidencia.getFechaSesion() != null && !evidencia.getAprobacionJuntaDirectiva().isBlank()
        && evidencia.getFechaAprobacion() != null) {
      evidenciaTrimestral.setRevisado(true);
      evidenciaTrimestral.setFechaSesion(evidencia.getFechaSesion());
      evidenciaTrimestral.setAprobado(evidencia.getAprobacionJuntaDirectiva());
      evidenciaTrimestral.setFechaAprobacion(evidencia.getFechaAprobacion());
    } else {
      evidenciaTrimestral.setRevisado(false);
    }

    if (evidencia.getIdTipoPublicacion() != null) {
      evidenciaTrimestral.setPublicacion(true);
      evidenciaTrimestral.setTipoPublicacion(evidencia.getIdTipoPublicacion());
      if (evidencia.getTipoPublicacion() != null)
        evidenciaTrimestral.setCdTipoPublicacion(evidencia.getTipoPublicacion().getCdOpcion());
      evidenciaTrimestral.setEspecificarPublicacion(evidencia.getEspecificarPublicacion());
    } else {
      evidenciaTrimestral.setPublicacion(false);
    }

    if (evidencia.getIdTipoDifusion() != null) {
      evidenciaTrimestral.setDifusion(true);
      evidenciaTrimestral.setTipoDifusion(evidencia.getIdTipoDifusion());
      if (evidencia.getTipoDifusion() != null)
        evidenciaTrimestral.setCdTipoDifusion(evidencia.getTipoDifusion().getCdOpcion());
      evidenciaTrimestral.setEspecificarDifusion(evidencia.getEspecificarDifusion());
    } else {
      evidenciaTrimestral.setDifusion(false);
    }

    return evidenciaTrimestral;
  }

  @Override
  public EvidenciaTrimestralVO consultarEvidenciaTrimestral(int idAvance) {
    var evidencia = trimestralRepository.findByIdAvance(idAvance)
        .orElseThrow(() -> new NotFoundException("No existe la evidencia trimestral para el avance " + idAvance));

    var evidenciaTrimestral = new EvidenciaTrimestralVO();
    // evidenciaTrimestral.setIndicadorMIR();
    evidenciaTrimestral.setMetaSuperada(evidencia.getMetaSuperada());
    evidenciaTrimestral.setDificultad(evidencia.getDificultadesSuperacion());

    if (evidencia.getFechaSesion() != null && !evidencia.getAprobacionJuntaDirectiva().isBlank()
        && evidencia.getFechaAprobacion() != null) {
      evidenciaTrimestral.setRevisado(true);
      evidenciaTrimestral.setFechaSesion(evidencia.getFechaSesion());
      evidenciaTrimestral.setAprobado(evidencia.getAprobacionJuntaDirectiva());
      evidenciaTrimestral.setFechaAprobacion(evidencia.getFechaAprobacion());
    } else {
      evidenciaTrimestral.setRevisado(false);
    }

    if (evidencia.getIdTipoPublicacion() != null) {
      evidenciaTrimestral.setPublicacion(true);
      evidenciaTrimestral.setTipoPublicacion(evidencia.getIdTipoPublicacion());
      if (evidencia.getTipoPublicacion() != null)
        evidenciaTrimestral.setCdTipoPublicacion(evidencia.getTipoPublicacion().getCdOpcion());
      evidenciaTrimestral.setEspecificarPublicacion(evidencia.getEspecificarPublicacion());
    } else {
      evidenciaTrimestral.setPublicacion(false);
    }

    if (evidencia.getIdTipoDifusion() != null) {
      evidenciaTrimestral.setDifusion(true);
      evidenciaTrimestral.setTipoDifusion(evidencia.getIdTipoDifusion());
      if (evidencia.getTipoDifusion() != null)
        evidenciaTrimestral.setCdTipoDifusion(evidencia.getTipoDifusion().getCdOpcion());
      evidenciaTrimestral.setEspecificarDifusion(evidencia.getEspecificarDifusion());
    } else {
      evidenciaTrimestral.setDifusion(false);
    }

    return evidenciaTrimestral;
  }

  @Override
  public EvidenciaMensualVO consultarEvidenciaMensual(int idProducto, int mes) {
    EvidenciaMensual evidenciaMensual = mensualRepository.findByIdProductoAndMes(idProducto, mes)
        .orElseThrow(() -> new NotFoundException(
            "No existe la evidencia mensual para el producto " + idProducto + " y mes " + mes));

    EvidenciaMensualVO evidenciaMensualVO = new EvidenciaMensualVO();
    evidenciaMensualVO.setDescripcionTareas(evidenciaMensual.getDescripcionTareas());
    evidenciaMensualVO.setJustificacion(evidenciaMensual.getJustificacion());
    evidenciaMensualVO.setDescripcionProducto(evidenciaMensual.getDescripcionProducto());
    evidenciaMensualVO.setEstatus(evidenciaMensual.getEstatus());
    evidenciaMensual.getEvidenciaDocumentos().stream().map(evidenciaDocumento -> {
      ArchivoBase archivo = new ArchivoBase();
      // LocalDate + LocalTime = LocalDateTime
      var fecha = evidenciaDocumento.getArchivo().getFechaCarga();
      var hora = evidenciaDocumento.getArchivo().getHoraCarga();
      archivo.setFechaCarga(fecha.atTime(hora).toString());

      archivo.setIdArchivo(evidenciaDocumento.getArchivo().getIdArchivo());
      archivo.setNombre(evidenciaDocumento.getArchivo().getNombre());
      archivo.setUuid(evidenciaDocumento.getArchivo().getUuid());
      return archivo;
    }).forEach(evidenciaMensualVO.getArchivos()::add);

    return evidenciaMensualVO;
  }

  @Override
  public EvidenciaMensualVO consultarEvidenciaMensual(int idAvance) {
    var evidenciaMensual = mensualRepository.findByIdAvance(idAvance)
        .orElseThrow(() -> new NotFoundException("No existe la evidencia mensual para el avance " + idAvance));

    var evidenciaMensualVO = new EvidenciaMensualVO();
    evidenciaMensualVO.setDescripcionTareas(evidenciaMensual.getDescripcionTareas());
    evidenciaMensualVO.setJustificacion(evidenciaMensual.getJustificacion());
    evidenciaMensualVO.setDescripcionProducto(evidenciaMensual.getDescripcionProducto());
    evidenciaMensualVO.setEstatus(evidenciaMensual.getEstatus());
    evidenciaMensual.getEvidenciaDocumentos().stream().map(evidenciaDocumento -> {
      ArchivoBase archivo = new ArchivoBase();
      // LocalDate + LocalTime = LocalDateTime
      var fecha = evidenciaDocumento.getArchivo().getFechaCarga();
      var hora = evidenciaDocumento.getArchivo().getHoraCarga();
      archivo.setFechaCarga(fecha.atTime(hora).toString());

      archivo.setIdArchivo(evidenciaDocumento.getArchivo().getIdArchivo());
      archivo.setNombre(evidenciaDocumento.getArchivo().getNombre());
      archivo.setUuid(evidenciaDocumento.getArchivo().getUuid());
      return archivo;
    }).forEach(evidenciaMensualVO.getArchivos()::add);

    return evidenciaMensualVO;
  }

  @Override
  @Transactional
  public RespuestaMetasVencidasAdelantadasVO registrarMetasVencidas(PeticionRegistroMetasExtraordinarias peticion, String cveUsuario) {
    Usuario usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));
    TipoDocumento tipoDocumento = tipoDocumentoRepository.findByExtension("pdf");
    var productoProgramado = productoCalendarioRepository.find("idProducto = ?1 and ciMes = ?2", peticion.getIdProducto(), peticion.getMesProgramado())
        .firstResultOptional().orElseThrow(() -> new NotFoundException(
            "No existe el producto con id " + peticion.getIdProducto() + " y mes " + peticion.getMesProgramado()));
    var productoEntregado = productoCalendarioRepository.find("idProducto = ?1 and ciMes = ?2", peticion.getIdProducto(), peticion.getMesEntregado())
        .firstResultOptional().orElseThrow(() -> new NotFoundException(
            "No existe el producto con id " + peticion.getIdProducto() + " y mes " + peticion.getMesEntregado()));

    productoEntregado.setCiEntregados(peticion.getMontoEntregado());
    productoCalendarioRepository.persist(productoEntregado);

    Avance avance = avanceRepository.find("productoCalendario.idProdcal = ?1 AND ixTipoRegistro = ?2", productoProgramado.getIdProdcal(), peticion.getIxTipoMeta())
        .firstResultOptional()
        .orElseGet(Avance::new);

    var evidenciaTrimestral = getEvidenciaTrimestral(peticion, avance);

    trimestralRepository.persistAndFlush(evidenciaTrimestral);

    EvidenciaMensual evidenciaMensual = avance.getEvidenciaMensual() != null
        ? avance.getEvidenciaMensual()
        : new EvidenciaMensual();
    evidenciaMensual.setEstatus(EstatusEnum.COMPLETO.getEstatus());
    evidenciaMensual.setJustificacion(peticion.getEvidencia().getJustificacion());
    evidenciaMensual.setDescripcionTareas(peticion.getEvidencia().getDescripcionTareas());
    evidenciaMensual.setDescripcionProducto(peticion.getEvidencia().getDescripcionProducto());

    mensualRepository.persistAndFlush(evidenciaMensual);

    documentoRepository.delete("id.idEvidenciaMensual = ?1", evidenciaMensual.getIdEvidenciaMensual());
    peticion.getEvidencia().getArchivos().forEach(archivoVO -> {
      var archivoDB = archivoRepository.find("uuid", archivoVO.getUuid()).firstResultOptional()
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

      archivoRepository.persistAndFlush(archivoDB);

      EvidenciaDocumento evidenciaDocumento = new EvidenciaDocumento();
      EvidenciaDocumentoPK evidenciaDocumentoPK = new EvidenciaDocumentoPK();
      evidenciaDocumentoPK.setIdEvidenciaMensual(evidenciaMensual.getIdEvidenciaMensual());
      evidenciaDocumentoPK.setIdArchivo(archivoDB.getIdArchivo());
      evidenciaDocumento.setId(evidenciaDocumentoPK);
      documentoRepository.persistAndFlush(evidenciaDocumento);
    });

    // avance.setCortoplazoActividad(actividad);
    avance.setProductoCalendario(productoProgramado);
    avance.setProductoCalendarioEntregado(productoEntregado);
    avance.setEvidenciaMensual(evidenciaMensual);
    avance.setEvidenciaTrimestral(evidenciaTrimestral);
    avance.setIxTipoRegistro(peticion.getIxTipoMeta());
    avance.setCveUsuario(cveUsuario);

    avanceRepository.persistAndFlush(avance);

    var respuesta = new RespuestaMetasVencidasAdelantadasVO();
    respuesta.setIdAvance(avance.getIdAvance());
    respuesta.setIdEvidenciaMensual(evidenciaMensual.getIdEvidenciaMensual());
    respuesta.setIdEvidenciaTrimestral(evidenciaTrimestral.getIdEvidenciaTrimestral());

    return respuesta;
  }

  private static EvidenciaTrimestral getEvidenciaTrimestral(PeticionRegistroMetasExtraordinarias peticion, Avance avance) {
    var evidenciaTrimestral = avance.getEvidenciaTrimestral() != null
        ? avance.getEvidenciaTrimestral()
        : new EvidenciaTrimestral();
    evidenciaTrimestral.setIdArticulacionActividades(peticion.getEvidenciaComplementaria().getIdArticulacion());
    evidenciaTrimestral.setDificultadesSuperacion(peticion.getEvidenciaComplementaria().getDificultad());

    if (peticion.getEvidenciaComplementaria().getRevisado()) {
      evidenciaTrimestral.setFechaSesion(peticion.getEvidenciaComplementaria().getFechaSesion());
      evidenciaTrimestral.setAprobacionJuntaDirectiva(peticion.getEvidenciaComplementaria().getAprobado());
      evidenciaTrimestral.setFechaAprobacion(peticion.getEvidenciaComplementaria().getFechaAprobacion());
    }

    if (peticion.getEvidenciaComplementaria().getPublicacion()) {
      evidenciaTrimestral.setIdTipoPublicacion(peticion.getEvidenciaComplementaria().getTipoPublicacion());
      evidenciaTrimestral.setEspecificarPublicacion(peticion.getEvidenciaComplementaria().getEspecificarPublicacion());
    }

    if (peticion.getEvidenciaComplementaria().getDifusion()) {
      evidenciaTrimestral.setIdTipoDifusion(peticion.getEvidenciaComplementaria().getTipoDifusion());
      evidenciaTrimestral.setEspecificarDifusion(peticion.getEvidenciaComplementaria().getEspecificarDifusion());
    }
    return evidenciaTrimestral;
  }
}
