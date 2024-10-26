package mx.sep.dgtic.sipse.presupuestal.service.impl;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.presupuestales.NodoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionArbolVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaArbolVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaNodoVO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.sipse.presupuestal.dao.ArbolNodoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ArbolRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ArchivoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ProgramaPresupuestalRepository;
import mx.sep.dgtic.sipse.presupuestal.entity.Arbol;
import mx.sep.dgtic.sipse.presupuestal.entity.ArbolNodo;
import mx.sep.dgtic.sipse.presupuestal.entity.Archivo;
import mx.sep.dgtic.sipse.presupuestal.service.ArbolProblemaService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ArbolProblemaServiceImpl implements ArbolProblemaService {
  @ConfigProperty(name = "programa_presupuestal.p016")
  private Integer ID_P016;
  private static final int TIPO_ARBOL_PROBLEMA = 1;
  private static final int TIPO_ARBOL_OBJETIVO = 2;
  private static final int RAMA_CAUSAS = 1;
  private static final int TIPO_CAUSA = 2;
  private static final int RAMA_EFECTOS = 3;
  private static final int TIPO_EFECTO = 4;
  private static final int RAMA_MEDIOS = 5;
  private static final int RAMA_FINES = 9;
  @Autowired
  private ProgramaPresupuestalRepository programaPresupuestalRepository;
  @Autowired
  private ArbolRepository arbolRepository;
  @Autowired
  private ArbolNodoRepository arbolNodoRepository;
  @Autowired
  private ArchivoRepository archivoRepository;

  @Override
  public RespuestaArbolVO consultarPorAnhio(int idAnhio) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(idAnhio, ID_P016)
            .orElseThrow(() -> new NotFoundException("No se encontró el programa presupuestal del año: " + idAnhio));
    var arbol = arbolRepository.consultarPorPrograma(programa.getIdPresupuestal(), TIPO_ARBOL_PROBLEMA)
            .orElseThrow(() -> new NotFoundException("No se encontró el árbol del programa presupuestal del año: " + idAnhio));
    var nodos = arbolNodoRepository.findTreeRoots(arbol.getIdArbol());
    return entitiesToVo(arbol, nodos);
  }

  @Override
  public RespuestaArbolVO consultarPorProgramaPresupuestal(int idProgramaPresupuestal) {
    var programa = programaPresupuestalRepository.findByIdOptional(idProgramaPresupuestal)
            .orElseThrow(() -> new NotFoundException("No se encontró el programa prosupuestal con el id: " + idProgramaPresupuestal));
    var arbol = arbolRepository.consultarPorPrograma(programa.getIdPresupuestal(), TIPO_ARBOL_PROBLEMA)
            .orElseThrow(() -> new NotFoundException("No se encontró el árbol del programa presupuestal con el id: " + idProgramaPresupuestal));
    var nodos = arbolNodoRepository.findTreeRoots(arbol.getIdArbol());
    return entitiesToVo(arbol, nodos);
  }

  @Override
  public RespuestaArbolVO consultarPorId(int id) {
    var arbol = arbolRepository.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("No se encontró el árbol con el id: " + id));
    var nodos = arbolNodoRepository.findTreeRoots(arbol.getIdArbol());
    return entitiesToVo(arbol, nodos);
  }

  @Override
  @Transactional
  public void registrar(PeticionArbolVO peticionArbol) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(peticionArbol.getIdAnhio(), ID_P016)
            .orElseThrow(() -> new NotFoundException("No se encontró el programa presupuestal del año: " + peticionArbol.getIdAnhio()));

    var arbol = arbolRepository.consultarPorPrograma(programa.getIdPresupuestal(), TIPO_ARBOL_PROBLEMA).orElseGet(() -> {
      var nuevoArbol = new Arbol();
      nuevoArbol.setIdPresupuestal(programa.getIdPresupuestal());
      nuevoArbol.setIxTipo(TIPO_ARBOL_PROBLEMA);
      return nuevoArbol;
    });

    var arbolObjetivo = arbolRepository.consultarPorPrograma(programa.getIdPresupuestal(), TIPO_ARBOL_OBJETIVO).orElseGet(() -> {
      var nuevoArbol = new Arbol();
      nuevoArbol.setIdPresupuestal(programa.getIdPresupuestal());
      nuevoArbol.setIxTipo(TIPO_ARBOL_OBJETIVO);
      return nuevoArbol;
    });

    var nodos = arbol.getNodos().stream().filter(it -> it.getIdNodoPadre() == null).toList();
    var nodosObjetivo = arbolObjetivo.getNodos().stream().filter(it -> it.getIdNodoPadre() == null).toList();

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

    arbol.setCxDescripcion(peticionArbol.getProblemaCentral());
    arbolObjetivo.setCxDescripcion(peticionArbol.getProblemaCentral());

    arbolRepository.persist(arbol);
    arbolRepository.persist(arbolObjetivo);

    var ramaCausas = nodos.stream()
            .filter(it -> it.getIxTipo() == RAMA_CAUSAS)
            .findFirst()
            .orElseGet(() -> {
              var nuevaRamaCausas = new ArbolNodo();
              nuevaRamaCausas.setCxClave("C-0");
              nuevaRamaCausas.setCxDescripcion("Causas");
              nuevaRamaCausas.setIxTipo(RAMA_CAUSAS);
              nuevaRamaCausas.setIdArbol(arbol.getIdArbol());
              arbolNodoRepository.persist(nuevaRamaCausas);
              return nuevaRamaCausas;
            });
    var ramaEfectos = nodos.stream()
            .filter(it -> it.getIxTipo() == RAMA_EFECTOS)
            .findFirst()
            .orElseGet(() -> {
              var nuevaRamaEfectos = new ArbolNodo();
              nuevaRamaEfectos.setCxClave("E-0");
              nuevaRamaEfectos.setCxDescripcion("Efectos");
              nuevaRamaEfectos.setIxTipo(RAMA_EFECTOS);
              nuevaRamaEfectos.setIdArbol(arbol.getIdArbol());
              arbolNodoRepository.persist(nuevaRamaEfectos);
              return nuevaRamaEfectos;
            });
    var ramaMedios = nodosObjetivo.stream()
            .filter(it -> it.getIxTipo() == RAMA_MEDIOS)
            .findFirst()
            .orElseGet(() -> {
              var nuevaRamaMedios = new ArbolNodo();
              nuevaRamaMedios.setCxClave("M-0");
              nuevaRamaMedios.setCxDescripcion("Medios");
              nuevaRamaMedios.setIxTipo(RAMA_MEDIOS);
              nuevaRamaMedios.setIdArbol(arbolObjetivo.getIdArbol());
              arbolNodoRepository.persist(nuevaRamaMedios);
              return nuevaRamaMedios;
            });
    var ramaFines = nodosObjetivo.stream()
            .filter(it -> it.getIxTipo() == RAMA_FINES)
            .findFirst()
            .orElseGet(() -> {
              var nuevaRamaFines = new ArbolNodo();
              nuevaRamaFines.setCxClave("F-0");
              nuevaRamaFines.setCxDescripcion("Fines");
              nuevaRamaFines.setIxTipo(RAMA_FINES);
              nuevaRamaFines.setIdArbol(arbolObjetivo.getIdArbol());
              arbolNodoRepository.persist(nuevaRamaFines);
              return nuevaRamaFines;
            });

    peticionArbol.getCausas().forEach(causa -> {
      saveNodoRecursive(causa, ramaCausas, arbol, ramaMedios, arbolObjetivo);
    });
    ramaCausas.getNodosHijos().forEach(arbolNodoRepository::delete);

    peticionArbol.getEfectos().forEach(efecto -> {
      saveNodoRecursive(efecto, ramaEfectos, arbol, ramaFines, arbolObjetivo);
    });
    ramaEfectos.getNodosHijos().forEach(arbolNodoRepository::delete);
  }

  private void saveNodoRecursive(NodoVO nodoVO, ArbolNodo nodoPadre, Arbol arbol, ArbolNodo nodoPadreEspejo, Arbol arbolEspejo) {
    saveNodoRecursive(nodoVO, nodoPadre, arbol, nodoPadreEspejo, arbolEspejo, 1);
  }

  private void saveNodoRecursive(NodoVO nodoVO, ArbolNodo nodoPadre, Arbol arbol, ArbolNodo nodoPadreEspejo, Arbol arbolEspejo, int nivel) {
    if (nodoVO.getIdNodo() == null) {
      // Crear nodo
      var nodo = new ArbolNodo();
      nodo.setCxClave(nodoVO.getClave());
      nodo.setCxDescripcion(nodoVO.getDescripcion());
      nodo.setIdArbol(arbol.getIdArbol());
      if (nodoPadre.getIxTipo() != null) {
        if (nodoPadre.getIxTipo() == RAMA_CAUSAS || nodoPadre.getIxTipo() == TIPO_CAUSA) {
          nodo.setIxTipo(TIPO_CAUSA);
        } else if (nodoPadre.getIxTipo() == RAMA_EFECTOS || nodoPadre.getIxTipo() == TIPO_EFECTO) {
          nodo.setIxTipo(TIPO_EFECTO);
        }
      }
      nodo.setIdNodoPadre(nodoPadre.getIdArbolNodo());
      arbolNodoRepository.persist(nodo);

      // Crear copia del nodo en el árbol objetivo
      var nodoEspejo = new ArbolNodo();
      nodoEspejo.setCxClave(nodoVO.getClave());
      nodoEspejo.setCxDescripcion(nodoVO.getDescripcion());
      nodoEspejo.setIdArbol(arbolEspejo.getIdArbol());
      nodoEspejo.setIdNodoPadre(nodoPadreEspejo.getIdArbolNodo());
      nodoEspejo.setIdEspejo(nodo.getIdArbolNodo());
      arbolNodoRepository.persist(nodoEspejo);
      arbolEspejo.getNodos().add(nodoEspejo);

      nodoVO.getHijos().forEach(nodoHijo -> {
        saveNodoRecursive(nodoHijo, nodo, arbol, nodoEspejo, arbolEspejo, nivel + 1);
      });
    } else {
      // Actualizar nodo
      var previoNodo = nodoPadre.getNodosHijos().stream()
              .filter(it -> it.getIdArbolNodo().equals(nodoVO.getIdNodo()))
              .findFirst()
              .orElseThrow(() -> new NotFoundException("No se encontró el nodo con el id: " + nodoVO.getIdNodo()));
      nodoPadre.getNodosHijos().remove(previoNodo);
      previoNodo.setCxClave(nodoVO.getClave());
      previoNodo.setCxDescripcion(nodoVO.getDescripcion());
      arbolNodoRepository.persist(previoNodo);

      nodoVO.getHijos().forEach(nodoHijo -> {
        saveNodoRecursive(nodoHijo, previoNodo, arbol, previoNodo.getEspejoHijo(), arbolEspejo, nivel + 1);
      });

      previoNodo.getNodosHijos().forEach(arbolNodoRepository::delete);
    }
  }

  private RespuestaArbolVO entitiesToVo(Arbol arbol, List<ArbolNodo> roots) {
    var vo = new RespuestaArbolVO();
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

      vo.setEsquema(archivoVO);
    }

    var causas = vo.getCausas();
    var efectos = vo.getEfectos();

    roots.forEach(nodo -> {
              if (nodo.getIxTipo() == RAMA_CAUSAS) {
                nodo.getNodosHijos().stream()
                        .map(this::recursiveEntitiesToVo)
                        .forEach(causas::add);
              } else if (nodo.getIxTipo() == RAMA_EFECTOS) {
                nodo.getNodosHijos().stream()
                        .map(this::recursiveEntitiesToVo)
                        .forEach(efectos::add);
              }
            });

    causas.sort(Comparator.comparing(RespuestaNodoVO::getIdNodo));
    efectos.sort(Comparator.comparing(RespuestaNodoVO::getIdNodo));

    return vo;
  }

  private RespuestaNodoVO recursiveEntitiesToVo(ArbolNodo nodo) {
    return recursiveEntitiesToVo(nodo, 1);
  }

  private RespuestaNodoVO recursiveEntitiesToVo(ArbolNodo nodo, int nivel) {
    var vo = new RespuestaNodoVO();
    vo.setIdNodo(nodo.getIdArbolNodo());
    vo.setNivel(nivel);
    vo.setClave(nodo.getCxClave());
    vo.setDescripcion(nodo.getCxDescripcion());

    nodo.getNodosHijos().stream()
            .map(nodoHijo -> recursiveEntitiesToVo(nodoHijo, nivel + 1))
            .forEach(vo.getHijos()::add);
    vo.getHijos().sort(Comparator.comparing(RespuestaNodoVO::getIdNodo));
    return vo;
  }
}
