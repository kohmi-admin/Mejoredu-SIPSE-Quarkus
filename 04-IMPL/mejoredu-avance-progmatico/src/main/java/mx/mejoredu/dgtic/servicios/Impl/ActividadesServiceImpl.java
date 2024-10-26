package mx.mejoredu.dgtic.servicios.Impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ActividadBaseVO;
import mx.mejoredu.dgtic.dao.*;
import mx.mejoredu.dgtic.entity.CortoplazoActividad;
import mx.mejoredu.dgtic.entity.RevisionTrimestral;
import mx.mejoredu.dgtic.servicios.ActividadesService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ActividadesServiceImpl implements ActividadesService {
  @Inject
  private CortoplazoActividadRepository cortoplazoActividadRepository;
  @Inject
  private ProyectoAnualRepository proyectoAnualRepository;
  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;
  @Inject
  private MetRevisionValidacionRepository metRevisionValidacionRepository;

  @Override
  public List<ActividadBaseVO> consultaActividades(int idProyecto, Integer trimestre) {
    proyectoAnualRepository.findByIdOptional(idProyecto).orElseThrow(
        () -> new NotFoundException("El proyecto con el id " + idProyecto + " no está registrado")
    );
    var actividades = cortoplazoActividadRepository.findActividades(idProyecto, trimestre);

    return actividades.stream().map(it -> this.entitiesToVo(it, trimestre)).toList();
  }

  @Override
  public List<ActividadBaseVO> consultaActividadesPorAnhio(int anhio) {
    var actividades = cortoplazoActividadRepository.findActividadesByAnhio(anhio);

    return actividades.stream().map(this::entitiesToVo).toList();
  }

  @Override
  public List<ActividadBaseVO> consultaActividadesPorAnhio(int anhio, int trimestre, int tipoRegistro) {
    var anhioObjetivo = anhio;
    var trimestreObjetivo = tipoRegistro == 1 ? trimestre - 1 : trimestre + 1;
    if (trimestreObjetivo < 1) {
      anhioObjetivo = anhio - 1;
      trimestreObjetivo = 4;
    }

    var tO = trimestreObjetivo;
    var aO = anhioObjetivo;

    var actividades = cortoplazoActividadRepository.findActividadesByAnhio(aO, tO)
        .stream().filter(it -> {
          var productos = it.getProducto();
          if (productos.isEmpty()) {
            return false;
          }

          var productosConEntregables = productos.stream().filter(p -> {
            var entregables = p.getProductoCalendario();
            if (entregables.isEmpty()) {
              return false;
            }

            var entregablesProgramados = entregables.stream().filter(e -> {
              if (Math.ceil(e.getCiMes() / 3f) != tO) {
                return false;
              }
              return e.getCiMonto() != null && e.getCiMonto() != 0;
            }).toList();

            return !entregablesProgramados.isEmpty();
          }).toList();

          return !productosConEntregables.isEmpty();
        })
        .toList();

    return actividades.stream().map(this::entitiesToVo).toList();
  }

  @Override
  public List<ActividadBaseVO> consultaActividadesPorAnhioAndUnidad(int anhio, String cveUsuario) {
    var perfilLaboral = perfilLaboralRepository.findByCveUsuario(cveUsuario).orElseThrow(
        () -> new NotFoundException("El perfil laboral del usuario con la clave " + cveUsuario + " no está registrado")
    );

    Log.info("Perfil laboral: " + perfilLaboral.getIdCatalogoUnidad());

    var actividades = cortoplazoActividadRepository.findActividadesByAnhioAndUnidad(anhio, perfilLaboral.getIdCatalogoUnidad());

    return actividades.stream().map(this::entitiesToVo).toList();
  }

  private ActividadBaseVO entitiesToVo(CortoplazoActividad actividad) {
    ActividadBaseVO actividadVo = new ActividadBaseVO();

    actividadVo.setIdActividad(actividad.getIdActividad());
    actividadVo.setCveActividad(actividad.getCveActividad());
    actividadVo.setCxNombreActividad(actividad.getCxNombreActividad());
    actividadVo.setCxDescripcion(actividad.getCxDescripcion());
    actividadVo.setCxArticulacionActividad(actividad.getCxArticulacionActividad());
    actividadVo.setCveUsuario(actividad.getCveUsuario());
    // actividadVo.setObservaciones(!actividad.getRevisionTrimestral().isEmpty());
    if (actividad.getDfActividad() != null)
      actividadVo.setDfActividad(actividad.getDfActividad().toString());
    if (actividad.getDhActividad() != null)
      actividadVo.setDhActividad(actividad.getDhActividad().toString());
    actividadVo.setIdProyecto(actividad.getIdProyecto());

    if (actividad.getProyecto() != null) {
      actividadVo.setCveProyecto(actividad.getProyecto().getCveProyecto());

      if (actividad.getProyecto().getUnidadAdministrativa() != null) {
        actividadVo.setIdUnidad(actividad.getProyecto().getUnidadAdministrativa().getId());
        actividadVo.setCveUnidad(actividad.getProyecto().getUnidadAdministrativa().getCcExterna());
        actividadVo.setUnidad(actividad.getProyecto().getUnidadAdministrativa().getCcExternaDos());
      }
    }

    return actividadVo;
  }
  private ActividadBaseVO entitiesToVo(CortoplazoActividad actividad, Integer trimestre) {
    ActividadBaseVO actividadVo = new ActividadBaseVO();

    actividadVo.setIdActividad(actividad.getIdActividad());
    actividadVo.setCveActividad(actividad.getCveActividad());
    actividadVo.setCxNombreActividad(actividad.getCxNombreActividad());
    actividadVo.setCxDescripcion(actividad.getCxDescripcion());
    actividadVo.setCxArticulacionActividad(actividad.getCxArticulacionActividad());
    actividadVo.setCveUsuario(actividad.getCveUsuario());

    if (trimestre != null) {
      var revisionTrimestre = actividad.getRevisionTrimestral().stream()
          .filter(it -> Objects.equals(it.getTrimestre(), trimestre))
          .findFirst();

      if (revisionTrimestre.isPresent()) {
        metRevisionValidacionRepository.find("idValidacion = ?1 AND idElementoValidar = 247", revisionTrimestre.get().getIdValidacionPlaneacion())
            .firstResultOptional()
            .ifPresentOrElse(
                it -> actividadVo.setObservaciones(it.getCxComentario() != null && !it.getCxComentario().isEmpty()),
                () -> actividadVo.setObservaciones(false)
            );
        actividadVo.setEstatusRevision(revisionTrimestre.get().getCsEstatus());
      } else {
        actividadVo.setObservaciones(false);
        actividadVo.setEstatusRevision(null);
      }
    } else {
      var revisionesTrimestrales = actividad.getRevisionTrimestral().stream().toList();

      if (revisionesTrimestrales.isEmpty()) {
        actividadVo.setObservaciones(false);
      } else {
        // Set<Integer> Ids = revisionesTrimestrales.stream().map(MetRevisionValidacionEntity::getIdValidacionPlaneacion).collect(Collectors.toSet());
        var Ids = revisionesTrimestrales.stream()
            .map(RevisionTrimestral::getIdValidacionPlaneacion)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
        var revisionesComentadas = metRevisionValidacionRepository.list("idValidacion IN ?1 AND idElementoValidar = 247", Ids)
            .stream().filter(it -> it.getCxComentario() != null && !it.getCxComentario().isEmpty())
            .toList();

        actividadVo.setObservaciones(!revisionesComentadas.isEmpty());
      }

      if (revisionesTrimestrales.isEmpty()) {
        actividadVo.setEstatusRevision(null);
      } else if (revisionesTrimestrales.stream().allMatch(rev -> rev.getCsEstatus().equals(EstatusEnum.REVISADO.getEstatus()))) {
        actividadVo.setEstatusRevision(EstatusEnum.REVISADO.getEstatus());
      } else if (revisionesTrimestrales.stream().anyMatch(rev -> rev.getCsEstatus().equals(EstatusEnum.REVISADO.getEstatus()) || rev.getCsEstatus().equals(EstatusEnum.ENVALIDACION.getEstatus()))) {
        actividadVo.setEstatusRevision(EstatusEnum.ENVALIDACION.getEstatus());
      } else if (revisionesTrimestrales.stream().anyMatch(rev -> rev.getCsEstatus().equals(EstatusEnum.PORREVISAR.getEstatus()))) {
        actividadVo.setEstatusRevision(EstatusEnum.PORREVISAR.getEstatus());
      }
    }

    if (actividad.getDfActividad() != null)
      actividadVo.setDfActividad(actividad.getDfActividad().toString());
    if (actividad.getDhActividad() != null)
      actividadVo.setDhActividad(actividad.getDhActividad().toString());
    actividadVo.setIdProyecto(actividad.getIdProyecto());

    if (actividad.getProyecto() != null) {
      actividadVo.setCveProyecto(actividad.getProyecto().getCveProyecto());

      if (actividad.getProyecto().getUnidadAdministrativa() != null) {
        actividadVo.setIdUnidad(actividad.getProyecto().getUnidadAdministrativa().getId());
        actividadVo.setCveUnidad(actividad.getProyecto().getUnidadAdministrativa().getCcExterna());
        actividadVo.setUnidad(actividad.getProyecto().getUnidadAdministrativa().getCcExternaDos());
      }
    }

    return actividadVo;
  }
}
