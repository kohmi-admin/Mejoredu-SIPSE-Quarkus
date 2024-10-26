package mx.mejoredu.dgtic.servicios.Impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ProyectoBaseVO;
import mx.mejoredu.dgtic.dao.*;
import mx.mejoredu.dgtic.entity.RevisionTrimestral;
import mx.mejoredu.dgtic.servicios.ProyectosService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProyectosServiceImpl implements ProyectosService {
  @Inject
  private ProyectoAnualRepository proyectoAnualRepository;
  @Inject
  private CortoplazoActividadRepository cortoplazoActividadRepository;
  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private RevisionTrimestralRepository revisionTrimestralRepository;
  @Inject
  private MetRevisionValidacionRepository metRevisionValidacionRepository;

  @Override
  public List<ProyectoBaseVO> consultaPAA(int idAnhio, String cveUsuario, Integer trimestre) {
    var usuario = usuarioRepository.findByIdOptional(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No se encontró el usuario " + cveUsuario));
    var perfil = perfilLaboralRepository.findByCveUsuario(cveUsuario)
        .orElseThrow(() -> new BadRequestException("No se encontró el perfil laboral del usuario " + cveUsuario));
    var proyectos = usuario.hasReadPermission()
        ? proyectoAnualRepository.findPAATrimestre(idAnhio, trimestre)
        : proyectoAnualRepository.findPAA(idAnhio, perfil.getIdCatalogoUnidad(), trimestre);

    return proyectos.stream().map(proyecto -> {
      ProyectoBaseVO proyectoVo = new ProyectoBaseVO();
      proyectoVo.setNombreProyecto(proyecto.getCxNombreProyecto());
      proyectoVo.setCveProyecto(String.valueOf(proyecto.getCveProyecto()));
      proyectoVo.setIdProyecto(proyecto.getIdProyecto());
      proyectoVo.setIdAnhio(proyecto.getAnhoPlaneacion().getIdAnhio());
      proyectoVo.setEstatus(proyecto.getCsEstatus());
      proyectoVo.setCveUnidad(proyecto.getCveUnidad());

      // Si todas las actividades están Revisadas, el proyecto se considera Revisado
      // Si al menos una actividad está revisada, el proyecto se considera En Revisión
      // Si al menos una actividad está Por Revisar, el proyecto se considera Por Revisar
      if (trimestre != null) {
        Log.info("Proyecto: " + proyecto.getActividad());

        var actividadesEstatus = proyecto.getActividad().stream().map(actividad -> {
          var revisionesTrimestre = actividad.getRevisionTrimestral().stream()
              .filter(revision -> revision.getTrimestre().equals(trimestre))
              .findFirst();

          if (revisionesTrimestre.isPresent()) {
            var estatus = revisionesTrimestre.get().getCsEstatus();
            boolean observaciones;

            if (revisionesTrimestre.get().getIdValidacionPlaneacion() == null) {
              return new ActividadData(estatus, false);
            }

            var revisiones = metRevisionValidacionRepository.find("idValidacion = ?1 AND idElementoValidar = 247", revisionesTrimestre.get().getIdValidacionPlaneacion())
                .firstResultOptional();

            if (revisiones.isPresent()) {
              var it = revisiones.get();
              observaciones = (it.getCxComentario() != null && !it.getCxComentario().isEmpty());
            } else {
              observaciones = false;
            }

            // Should return a new object with the status and the observations
            return new ActividadData(estatus, observaciones);
          }

          return new ActividadData(null, false);
        }).toList();

        Log.info("ActividadesEstatus: " + actividadesEstatus);

        // Sí el estatus de todas las actividades es null, el proyecto se considera Null
        if (actividadesEstatus.stream().map(ActividadData::getEstatus).allMatch(Objects::isNull)) {
          proyectoVo.setEstatusRevision(null);
        } else {
          var noNullEstatus = actividadesEstatus.stream().filter(Objects::nonNull).toList();

          if (noNullEstatus.stream().map(ActividadData::getEstatus).allMatch(estatus -> estatus.equals(EstatusEnum.REVISADO.getEstatus()))) {
            proyectoVo.setEstatusRevision(EstatusEnum.REVISADO.getEstatus());
          } else if (noNullEstatus.stream().map(ActividadData::getEstatus).anyMatch(estatus -> estatus.equals(EstatusEnum.REVISADO.getEstatus()))) {
            proyectoVo.setEstatusRevision(EstatusEnum.ENVALIDACION.getEstatus());
          } else if (noNullEstatus.stream().map(ActividadData::getEstatus).anyMatch(estatus -> estatus.equals(EstatusEnum.PORREVISAR.getEstatus()))) {
            proyectoVo.setEstatusRevision(EstatusEnum.PORREVISAR.getEstatus());
          }
        }

        proyectoVo.setObservaciones(actividadesEstatus.stream().anyMatch(ActividadData::getObservaciones));

      } else {
        var actividadesEstatus = proyecto.getActividad().stream().map(actividad -> {
          var revisionesTrimestre = actividad.getRevisionTrimestral().stream().toList();

          String estatus;
          boolean observaciones;

          if (revisionesTrimestre.isEmpty()) {
            observaciones = false;
          } else {
            var Ids = revisionesTrimestre.stream()
                .map(RevisionTrimestral::getIdValidacionPlaneacion)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
            var revisionesComentadas = metRevisionValidacionRepository.list("idValidacion IN ?1 AND idElementoValidar = 247", Ids)
                .stream().filter(it -> it.getCxComentario() != null && !it.getCxComentario().isEmpty())
                .toList();

            observaciones = !revisionesComentadas.isEmpty();

          }
          if (revisionesTrimestre.isEmpty()) {
            estatus = null;
          } else if (revisionesTrimestre.stream().allMatch(rev -> rev.getCsEstatus().equals(EstatusEnum.REVISADO.getEstatus()))) {
            estatus = EstatusEnum.REVISADO.getEstatus();
          } else if (revisionesTrimestre.stream().anyMatch(rev -> rev.getCsEstatus().equals(EstatusEnum.REVISADO.getEstatus()))) {
            estatus = EstatusEnum.ENVALIDACION.getEstatus();
          } else if (revisionesTrimestre.stream().anyMatch(rev -> rev.getCsEstatus().equals(EstatusEnum.PORREVISAR.getEstatus()))) {
            estatus = EstatusEnum.PORREVISAR.getEstatus();
          } else {
            estatus = null;
          }

          return new ActividadData(estatus, observaciones);
        }).toList();

        if (actividadesEstatus.stream().map(ActividadData::getEstatus).allMatch(Objects::isNull)) {
          proyectoVo.setEstatusRevision(null);
        } else {
          var noNullEstatus = actividadesEstatus.stream().filter(Objects::nonNull).toList();

          if (noNullEstatus.stream().map(ActividadData::getEstatus).allMatch(estatus -> estatus.equals(EstatusEnum.REVISADO.getEstatus()))) {
            proyectoVo.setEstatusRevision(EstatusEnum.REVISADO.getEstatus());
          } else if (noNullEstatus.stream().map(ActividadData::getEstatus).anyMatch(estatus -> estatus.equals(EstatusEnum.REVISADO.getEstatus()))) {
            proyectoVo.setEstatusRevision(EstatusEnum.ENVALIDACION.getEstatus());
          } else if (noNullEstatus.stream().map(ActividadData::getEstatus).anyMatch(estatus -> estatus.equals(EstatusEnum.PORREVISAR.getEstatus()))) {
            proyectoVo.setEstatusRevision(EstatusEnum.PORREVISAR.getEstatus());
          }
        }

        proyectoVo.setObservaciones(actividadesEstatus.stream().anyMatch(ActividadData::getObservaciones));
      }

      return proyectoVo;
    }).toList();
  }

  @Override
  public List<ProyectoBaseVO> consultaPaaIdUnidad(int idAnhio, int idUnidad) {
    var proyectos = proyectoAnualRepository.findPAA(idAnhio, idUnidad);

    return proyectos.stream().map(proyecto -> {
      ProyectoBaseVO proyectoVo = new ProyectoBaseVO();
      proyectoVo.setNombreProyecto(proyecto.getCxNombreProyecto());
      proyectoVo.setCveProyecto(String.valueOf(proyecto.getCveProyecto()));
      proyectoVo.setIdProyecto(proyecto.getIdProyecto());
      proyectoVo.setIdAnhio(proyecto.getAnhoPlaneacion().getIdAnhio());
      proyectoVo.setEstatus(proyecto.getCsEstatus());
      proyectoVo.setCveUnidad(proyecto.getCveUnidad());
      return proyectoVo;
    }).toList();
  }

  @Override
  @Transactional
  public void enviarRevision(Integer idProyecto, Integer trimestre) {
    var actividades = cortoplazoActividadRepository.find("""
            SELECT actividad
            FROM CortoplazoActividad actividad
            LEFT JOIN AdecuacionActividad aa
              ON actividad.idActividad = aa.actividadModificacion.idActividad
            WHERE
              aa.actividadModificacion.idActividad IS NULL
              AND actividad.idProyecto = ?1
        """, idProyecto).list();

    for (var actividad : actividades) {
      var revisionTrimestral = revisionTrimestralRepository.findByIdActividadAndTrimestral(actividad.getIdActividad(), trimestre)
          .orElseGet(RevisionTrimestral::new);
      revisionTrimestral.setIdActividad(actividad.getIdActividad());
      revisionTrimestral.setTrimestre(trimestre);
      revisionTrimestral.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());

      revisionTrimestralRepository.persist(revisionTrimestral);
    }
  }

  @Data
  @AllArgsConstructor
  private class ActividadData {
    private String estatus;
    private Boolean observaciones;
  }
}
