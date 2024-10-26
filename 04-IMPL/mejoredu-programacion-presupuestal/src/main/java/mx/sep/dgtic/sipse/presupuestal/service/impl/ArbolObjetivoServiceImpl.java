package mx.sep.dgtic.sipse.presupuestal.service.impl;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionArbolObjetivoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionNodoArbolObjetivoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaArbolObjetivoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaNodoArbolObjetivoVO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.sipse.presupuestal.dao.*;
import mx.sep.dgtic.sipse.presupuestal.entity.*;
import mx.sep.dgtic.sipse.presupuestal.service.ArbolObjetivoService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ArbolObjetivoServiceImpl implements ArbolObjetivoService {
  @ConfigProperty(name = "programa_presupuestal.p016")
  private Integer ID_P016;
  @ConfigProperty(name = "catalogo.indicadores_mir")
  private Integer ID_INDICADORES_MIR;
  private static final int TIPO_ARBOL_OBJETIVO = 2;
  private static final int RAMA_MEDIOS = 5;
  private static final int RAMA_FINES = 9;
  @Autowired
  private ProgramaPresupuestalRepository programaPresupuestalRepository;
  @Autowired
  private ArbolRepository arbolRepository;
  @Autowired
  private ArbolNodoRepository arbolNodoRepository;
  @Autowired
  private MasterCatalogoRepository masterCatalogoRepository;
  @Autowired
  private IndicadorResultadoRepository indicadorResultadoRepository;
  @Autowired
  private ArchivoRepository archivoRepository;
  @Inject
  private UsuarioRepository usuarioRepository;

  @Override
  public RespuestaArbolObjetivoVO consultarPorAnhio(int idAnhio) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(idAnhio, ID_P016)
            .orElseThrow(() -> new NotFoundException("No se encontró el programa presupuestal del año: " + idAnhio));
    var arbol = arbolRepository.consultarPorPrograma(programa.getIdPresupuestal(), TIPO_ARBOL_OBJETIVO)
            .orElseThrow(() -> new NotFoundException("No se encontró el árbol del programa presupuestal del año: " + idAnhio));
    var nodos = arbolNodoRepository.findTreeRoots(arbol.getIdArbol());

    return entitiesToVO(arbol, nodos);
  }

  @Override
  public RespuestaArbolObjetivoVO consultarPorProgramaPresupuestal(int idProgramaPresupuestal) {
    var programa = programaPresupuestalRepository.findByIdOptional(idProgramaPresupuestal)
            .orElseThrow(() -> new NotFoundException("No se encontró el programa prosupuestal con el id: " + idProgramaPresupuestal));
    var arbol = arbolRepository.consultarPorPrograma(programa.getIdPresupuestal(), TIPO_ARBOL_OBJETIVO)
            .orElseThrow(() -> new NotFoundException("No se encontró el árbol del programa presupuestal con el id: " + idProgramaPresupuestal));
    var nodos = arbolNodoRepository.findTreeRoots(arbol.getIdArbol());

    return entitiesToVO(arbol, nodos);
  }

  @Override
  public RespuestaArbolObjetivoVO consultarPorId(int id) {
    var arbol = arbolRepository.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("No se encontró el árbol con el id: " + id));
    var nodos = arbolNodoRepository.findTreeRoots(arbol.getIdArbol());

    return entitiesToVO(arbol, nodos);
  }

  @Override
  @Transactional
  public void registrar(PeticionArbolObjetivoVO peticionArbol) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(peticionArbol.getIdAnhio(), ID_P016)
            .orElseThrow(() -> new NotFoundException("No se encontró el programa presupuestal del año: " + peticionArbol.getIdAnhio()));
    var arbol = arbolRepository.consultarPorPrograma(programa.getIdPresupuestal(), TIPO_ARBOL_OBJETIVO).orElseGet(() -> {
      var nuevoArbol = new Arbol();
      nuevoArbol.setIdPresupuestal(programa.getIdPresupuestal());
      nuevoArbol.setIxTipo(TIPO_ARBOL_OBJETIVO);
      return nuevoArbol;
    });

    if (peticionArbol.getEsquema() != null) {
      var nuevoArchivo = new Archivo();
      nuevoArchivo.setCxNombre(peticionArbol.getEsquema().getNombre());
      nuevoArchivo.setCxUuid(peticionArbol.getEsquema().getUuid());
      nuevoArchivo.setIdTipoDocumento(peticionArbol.getEsquema().getTipoArchivo());
      nuevoArchivo.setDfFechaCarga(LocalDate.now());
      nuevoArchivo.setDhHoraCarga(LocalTime.now());
      nuevoArchivo.setCsEstatus("A");
      nuevoArchivo.setCveUsuario(programa.getCveUsuario());

      archivoRepository.persist(nuevoArchivo);

      arbol.setIdArchivo(nuevoArchivo.getIdArchivo());
    }


    var nodos = arbol.getNodos().stream().filter(it -> it.getIdNodoPadre() == null).toList();

    arbol.setCxDescripcion(peticionArbol.getProblemaCentral());
    arbolRepository.persist(arbol);

    var ramaMedios = nodos.stream()
            .filter(it -> it.getIxTipo() == RAMA_MEDIOS)
            .findFirst()
            .orElseGet(() -> {
              var nuevaRamaMedios = new ArbolNodo();
              nuevaRamaMedios.setCxClave("M-0");
              nuevaRamaMedios.setCxDescripcion("Medios");
              nuevaRamaMedios.setIxTipo(RAMA_MEDIOS);
              nuevaRamaMedios.setIdArbol(arbol.getIdArbol());
              arbolNodoRepository.persist(nuevaRamaMedios);

              return nuevaRamaMedios;
            });

    var ramaEfectos = nodos.stream()
            .filter(it -> it.getIxTipo() == RAMA_FINES)
            .findFirst()
            .orElseGet(() -> {
              var nuevaRamaEfectos = new ArbolNodo();
              nuevaRamaEfectos.setCxClave("F-0");
              nuevaRamaEfectos.setCxDescripcion("Fines");
              nuevaRamaEfectos.setIxTipo(RAMA_FINES);
              nuevaRamaEfectos.setIdArbol(arbol.getIdArbol());
              arbolNodoRepository.persist(nuevaRamaEfectos);

              return nuevaRamaEfectos;
            });

    peticionArbol.getMedios().forEach(causa -> saveNodoRecursive(causa, ramaMedios));
    peticionArbol.getFines().forEach(efecto -> saveNodoRecursive(efecto, ramaEfectos));
  }

  private void saveNodoRecursive(PeticionNodoArbolObjetivoVO nodoVO, ArbolNodo nodoPadre) {
    saveNodoRecursive(nodoVO, nodoPadre, 1);
  }

  private void saveNodoRecursive(PeticionNodoArbolObjetivoVO nodoVO, ArbolNodo nodoPadre, int nivel) {
    var previoNodo = nodoPadre.getNodosHijos().stream()
            .filter(it -> it.getIdArbolNodo().equals(nodoVO.getIdNodo()))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("No se encontró el nodo con el id: " + nodoVO.getIdNodo()));
    previoNodo.setCxClave(nodoVO.getClave());
    previoNodo.setCxDescripcion(nodoVO.getDescripcion());
    previoNodo.setIxTipo(nodoVO.getIdTipo());
    // Fetch eager IndicadorResultado
    var indicadorResultado = previoNodo.getIndicadorResultado();
    Log.info("IndicadorResultado: " + indicadorResultado);

    /**
     * Indicador  = null && tipo !== null
     * Indicador != null && tipo != null
     * Indicador != null && tipo == null
     */

    // Se debe crear un MasterCatalogo para el tipo de nodo
    if (indicadorResultado == null && nodoVO.getIdTipo() != null) {
      Log.info("Creando MasterCatalogo para el nodo ");

      var indicador = new IndicadorResultado();
      indicador.setCxNivel(ixTipoNodoToClave(nodoVO.getIdTipo()));
      var ccExterna = ixTipoNodoToClave(nodoVO.getIdTipo()).charAt(0) + nodoVO.getClave();
      indicador.setCxClave(ccExterna);
      indicador.setCxNombre(nodoVO.getDescripcion());
      indicador.setIdPresupuestal(nodoPadre.getArbol().getIdPresupuestal());

      indicadorResultadoRepository.persist(indicador);

      previoNodo.setIdIndicadorResultado(indicador.getIdIndicadorResultado());
    } else if(indicadorResultado != null && nodoVO.getIdTipo() != null) {
      Log.info("Actualizando MasterCatalogo para el nodo ");

      var indicador = previoNodo.getIndicadorResultado();
      indicador.setCxNivel(ixTipoNodoToClave(nodoVO.getIdTipo()));
      var ccExterna = ixTipoNodoToClave(nodoVO.getIdTipo()).charAt(0) + nodoVO.getClave();
      indicador.setCxClave(ccExterna);
      indicador.setCxNombre(nodoVO.getDescripcion());

      indicadorResultadoRepository.persist(indicador);
    } else if (indicadorResultado != null && (nodoVO.getIdTipo() == null || nodoVO.getIdTipo() == 11)) {
      Log.info("Borrando IndicadorResultado para el nodo ");
      var indicador = previoNodo.getIndicadorResultado();
      indicadorResultadoRepository.delete(indicador);
    }

    arbolNodoRepository.persist(previoNodo);

    nodoVO.getHijos().forEach(nodoHijo -> saveNodoRecursive(nodoHijo, previoNodo, nivel + 1));
  }

  private RespuestaArbolObjetivoVO entitiesToVO(Arbol arbol, List<ArbolNodo> roots) {
    var vo = new RespuestaArbolObjetivoVO();
    vo.setIdArbol(arbol.getIdArbol());
    vo.setProblemaCentral(arbol.getCxDescripcion());
    vo.setFechaCreacion(arbol.getDfFechaRegistro().toLocalDateTime());
    vo.setIdAnhio(arbol.getProgramaPresupuestal().getIdAnhio());

    if (arbol.getArchivo() != null) {
      var archivoVO = new ArchivoDTO();

      archivoVO.setIdArchivo(arbol.getArchivo().getIdArchivo());
      archivoVO.setCxNombre(arbol.getArchivo().getCxNombre());
      archivoVO.setCxUuid(arbol.getArchivo().getCxUuid());
      archivoVO.setDfFechaCarga(arbol.getArchivo().getDfFechaCarga());
      archivoVO.setDfHoraCarga(arbol.getArchivo().getDhHoraCarga());
      archivoVO.setCsEstatus(arbol.getArchivo().getCsEstatus());
      archivoVO.setCveUsuario(arbol.getArchivo().getCveUsuario());
      archivoVO.setCxUuidToPdf(arbol.getArchivo().getCxUuidToPdf());
      archivoVO.setIdTipoDocumento(arbol.getArchivo().getIdTipoDocumento());

      vo.setEsquema(archivoVO);
    }

    var medios = vo.getMedios();
    var fines = vo.getFines();

    roots.forEach(nodo -> {
      if (nodo.getIxTipo() == RAMA_MEDIOS) {
        nodo.getNodosHijos().stream()
                .map(this::recursiveEntitiesToVo)
                .forEach(medios::add);
      } else if (nodo.getIxTipo() == RAMA_FINES) {
        nodo.getNodosHijos().stream()
                .map(this::recursiveEntitiesToVo)
                .forEach(fines::add);
      }
    });

    medios.sort(Comparator.comparing(RespuestaNodoArbolObjetivoVO::getIdNodo));
    fines.sort(Comparator.comparing(RespuestaNodoArbolObjetivoVO::getIdNodo));

    return vo;
  }

  private RespuestaNodoArbolObjetivoVO recursiveEntitiesToVo(ArbolNodo nodo) {
    return recursiveEntitiesToVo(nodo, 1);
  }

  private RespuestaNodoArbolObjetivoVO recursiveEntitiesToVo(ArbolNodo nodo, int nivel) {
    var vo = new RespuestaNodoArbolObjetivoVO();
    vo.setIdNodo(nodo.getIdArbolNodo());
    vo.setClave(nodo.getCxClave());
    vo.setDescripcion(nodo.getCxDescripcion());
    vo.setNivel(nivel);
    vo.setIdTipo(nodo.getIxTipo());

    nodo.getNodosHijos().stream()
            .map(nodoHijo -> recursiveEntitiesToVo(nodoHijo, nivel + 1))
            .forEach(vo.getHijos()::add);
    vo.getHijos().sort(Comparator.comparing(RespuestaNodoArbolObjetivoVO::getIdNodo));
    return vo;
  }

  private String ixTipoNodoToClave(int ixTipo) {
    return switch (ixTipo) {
      case 6 -> "Medio";
      case 7 -> "Componente";
      case 8 -> "Actividad";
      case 10 -> "Fin";
      default -> "N/A";
    };
  }
}
