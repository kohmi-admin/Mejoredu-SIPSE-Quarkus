package mx.mejoredu.dgtic.servicios.Impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.mejoredu.dgtic.dao.*;
import mx.mejoredu.dgtic.entity.*;
import mx.mejoredu.dgtic.servicios.ValidacionService;
import mx.sep.dgtic.mejoredu.cortoplazo.RubricaDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.Revision;
import mx.sep.dgtic.mejoredu.seguimiento.ValidacionDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ValidacionServiceImpl implements ValidacionService {
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private MetValidacionRepository validacionRepository;
  @Inject
  private MetRevisionValidacionRepository revisionValidacionRepository;
  @Inject
  private AvanceRepository avanceRepository;
  @Inject
  private RevisionTrimestralRepository revisionTrimestralRepository;
  @Inject
  private ValidacionRubricaRepository validacionRubricaRepository;
  @Inject
  private RubricaRepository rubricaRepository;

  @Override
  @Transactional
  public void guardar(ValidacionDTO peticion) {
    if (peticion.getApartado() == null) {
      throw new BadRequestException("El apartado no puede ser nulo");
    }
    if (peticion.getCveUsuario() == null) {
      throw new BadRequestException("La clave de usuario  no puede ser nula");
    }
    if (peticion.getId() == null) {
      throw new BadRequestException("El id no puede ser nulo");
    }

    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario())
        .orElseThrow(() -> new BadRequestException("El usuario no existe con la clave " + peticion.getCveUsuario()));
    var tipoUsuario = usuario.getTipoUsuario().getCdTipoUsuario();

    Log.info("Guardando validacion para el usuario");

    Log.info("Apartado: " + peticion.getApartado());
    if (peticion.getApartado().equalsIgnoreCase("REVISION-TRIMESTRAL-AVANCES-PROGRAMATICOS")) {
      var avance = revisionTrimestralRepository.findByIdActividadAndTrimestral(peticion.getId(), peticion.getTrimestre())
          // 1.- Debería crear un nuevo avance si no existe? o debería lanzar una excepción?
          .orElseGet(() -> {
            var nuevoAvance = new RevisionTrimestral();
            nuevoAvance.setIdActividad(peticion.getId());
            nuevoAvance.setTrimestre(peticion.getTrimestre());

            return nuevoAvance;
          });

      Integer idValidacion;

      // 2.- Qué usuarios pueden validar?
      // 3.- Cómo varía el flujo de validación dependiendo del tipo de usuario?
      if (TipoUsuarioEnum.ADMINISTRADOR.getCdTipoUsuario().equals(tipoUsuario)) {
        idValidacion = avance.getIdValidacionPlaneacion();
      } else if (TipoUsuarioEnum.PLANEACION.getCdTipoUsuario().equals(tipoUsuario)) {
        idValidacion = avance.getIdValidacionPlaneacion();
      } else {
        throw new BadRequestException("El usuario no tiene permisos para validar");
      }

      var validacion = idValidacion == null
          ? new MetValidacionEntity()
          : validacionRepository.findByIdOptional(idValidacion)
          .orElseGet(MetValidacionEntity::new);
      validacion.setDfValidacion(LocalDate.now());
      validacion.setDhValidacion(LocalTime.now());
      validacion.setCveUsuarioRegistra(peticion.getCveUsuario());
      validacion.setCveUsuarioActualiza(peticion.getCveUsuario());
      validacion.setCsEstatus(peticion.getEstatus());

      validacionRepository.persist(validacion);

      if (TipoUsuarioEnum.ADMINISTRADOR.getCdTipoUsuario().equals(tipoUsuario)) {
        avance.setIdValidacionPlaneacion(validacion.getIdValidacion());
      } else if (TipoUsuarioEnum.PLANEACION.getCdTipoUsuario().equals(tipoUsuario)) {
        avance.setIdValidacionPlaneacion(validacion.getIdValidacion());
      }
      // avance.setIxCicloValidacion(avance.getIxCicloValidacion() == null ? 1 : avance.getIxCicloValidacion() + 1);
      avance.setCsEstatus(peticion.getEstatus());
      revisionTrimestralRepository.persist(avance);

      // Asociar esta validacion con un producto y trimestre

      revisionValidacionRepository.delete("idValidacion", validacion.getIdValidacion());

      peticion.getRevision().forEach(el -> {
        var revision = new MetRevisionValidacionEntity();
        revision.setIxCheck(el.getCheck());
        revision.setCxComentario(el.getComentarios());
        revision.setIdElementoValidar(el.getIdElemento());
        revision.setIdValidacion(validacion.getIdValidacion());

        revisionValidacionRepository.persist(revision);

        if (TipoUsuarioEnum.PLANEACION.getCdTipoUsuario().equals(tipoUsuario)) {
          this.registrarRubrica(peticion, validacion);
        }

      });

      return;
    }
    Log.info("Este apartado no esta considerado");
    throw new BadRequestException("Este apartado no esta considerado en esta solucion");
  }

  @Override
  public ValidacionDTO consultarRevision(String apartado, Integer id, Integer trimestre, String rol) {
    switch (apartado) {
      case "REVISION-TRIMESTRAL-AVANCES-PROGRAMATICOS":
        var avanceOpt = revisionTrimestralRepository.findByIdActividadAndTrimestral(id, trimestre);
        if (avanceOpt.isEmpty()) {
          var respuesta = new ValidacionDTO();
          respuesta.setApartado(apartado);
          respuesta.setId(id);
          respuesta.setTrimestre(trimestre);
          return respuesta;
        }

        var avance = avanceOpt.get();

        Integer idValidacion = avance.getIdValidacionPlaneacion();

        /*
         - El usaurio Enlace puede ver los comentarios
         - El usuario Administrador realiza y ve comentarios
         - El usuario Planeación realiza comentarios ya que este se encarga de hacer la revisión trimestral
         */

        /*if (TipoUsuarioEnum.ADMINISTRADOR.getCdTipoUsuario().equalsIgnoreCase(rol)) {
          idValidacion = avance.getIdValidacionPlaneacion();
        } else if (TipoUsuarioEnum.PLANEACION.getCdTipoUsuario().equalsIgnoreCase(rol)) {
          idValidacion = avance.getIdValidacionPlaneacion();
        } else if (TipoUsuarioEnum.ENLACE.getCdTipoUsuario().equalsIgnoreCase(rol)) {
          idValidacion = avance.getIdValidacionPlaneacion();
        } else {
          throw new BadRequestException("El usuario no tiene permisos para validar");
        }*/

        var variasRevisiones = new ArrayList<Revision>();

        if (idValidacion == null) {
          var respuesta = new ValidacionDTO();
          respuesta.setApartado(apartado);
          respuesta.setId(id);
          respuesta.setTrimestre(trimestre);
          return respuesta;
        }

        var validacion = validacionRepository.findByIdOptional(idValidacion)
            .orElseThrow(() -> new BadRequestException("No se encontro la validacion con el id " + idValidacion));

        if (avance.getIdValidacionPlaneacion() != null) {
          var revisionesPlaneacion = revisionValidacionRepository.list("idValidacion", avance.getIdValidacionPlaneacion());

          var revisionesDTO = revisionesPlaneacion.stream().map(revision -> {
            Revision rev = new Revision();
            rev.setIdElemento(revision.getIdElementoValidar());
            rev.setComentarios(revision.getCxComentario());
            rev.setCheck(revision.getIxCheck());

            return rev;
          }).toList();
          variasRevisiones.addAll(revisionesDTO);
        }
        if (avance.getIdValidacionPlaneacion() != null && TipoUsuarioEnum.ADMINISTRADOR.getCdTipoUsuario().equalsIgnoreCase(rol)) {
          var revisionesSupervisor = revisionValidacionRepository.list("idValidacion", avance.getIdValidacionPlaneacion());

          var revisionesDTO = revisionesSupervisor.stream().map(revision -> {
            Revision rev = new Revision();
            rev.setIdElemento(revision.getIdElementoValidar());
            rev.setComentarios(revision.getCxComentario());
            rev.setCheck(revision.getIxCheck());

            return rev;
          }).toList();
          variasRevisiones.addAll(revisionesDTO);
        }

        var respuesta = new ValidacionDTO();
        respuesta.setApartado(apartado);
        respuesta.setCveUsuario(validacion.getCveUsuarioRegistra());
        respuesta.setEstatus(validacion.getCsEstatus());
        respuesta.setId(id);
        respuesta.setTrimestre(trimestre);

        respuesta.setRevision(variasRevisiones);
        if (idValidacion != null)
          respuesta.setRubrica(this.consultarRubrica(idValidacion));

        return respuesta;
      default:
        Log.info("Este apartado no esta considerado");
        throw new BadRequestException("Este apartado no esta considerado en esta solucion");
    }
  }

  private void registrarRubrica(ValidacionDTO peticion, MetValidacionEntity metValidacion) {
    validacionRubricaRepository.delete("validacion.idValidacion", metValidacion.getIdValidacion());
    peticion.getRubrica().stream().map(rubricaEnt -> {
      Log.info("RegistrarRubrica : " + rubricaEnt.getIdRubro());
      ValidacionRubrica validacion = new ValidacionRubrica();
      validacion.setCx_observaciones(rubricaEnt.getCxObservaciones());
      validacion.setIx_puntuacion(rubricaEnt.getIxPuntuacion());
      validacion.setDf_registro(LocalDate.now());
      validacion.setValidacion(metValidacion);
      Rubrica rubrica = rubricaRepository.findById(rubricaEnt.getIdRubro());
      validacion.setRubrica(rubrica);
      return validacion;
    }).forEach(validacionRubricaRepository::persistAndFlush);
  }

  private ArrayList<RubricaDTO> consultarRubrica(Integer idValidacion) {
    // Consultar la rubrica
    ArrayList<RubricaDTO> lstRubrica = new ArrayList<RubricaDTO>();

    List<ValidacionRubrica> lstRubricas = validacionRubricaRepository.find("validacion.idValidacion", idValidacion)
        .list();
    try {
      lstRubricas.stream().map(rubricaEnBD -> {
        RubricaDTO rubrica = new RubricaDTO();
        rubrica.setIdRubro(rubricaEnBD.getRubrica().getIdRubrica());
        rubrica.setIdRubrica(rubricaEnBD.getIdValidacionRubrica());
        rubrica.setIxPuntuacion(rubricaEnBD.getIx_puntuacion());
        rubrica.setCxObservaciones(rubricaEnBD.getCx_observaciones());

        return rubrica;
      }).forEach(lstRubrica::add);
    } catch (Exception e) {
      RubricaDTO noHayDatos = new RubricaDTO();
      noHayDatos.setCxObservaciones("No existe el idRubrica " + idValidacion);
      lstRubrica.add(noHayDatos);
    }

    return lstRubrica;
  }
}
