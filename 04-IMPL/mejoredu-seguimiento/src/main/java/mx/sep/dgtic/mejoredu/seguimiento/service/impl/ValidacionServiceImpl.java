package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import lombok.SneakyThrows;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.Revision;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ValidacionDTO;
import mx.sep.dgtic.mejoredu.seguimiento.RubricaDTO;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Archivo;
import mx.sep.dgtic.mejoredu.seguimiento.entity.MetArchivoValidacionEntity;
import mx.sep.dgtic.mejoredu.seguimiento.entity.MetRevisionValidacionEntity;
import mx.sep.dgtic.mejoredu.seguimiento.entity.MetValidacionEntity;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Rubrica;
import mx.sep.dgtic.mejoredu.seguimiento.entity.TipoDocumento;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Usuario;
import mx.sep.dgtic.mejoredu.seguimiento.entity.ValidacionRubrica;
import mx.sep.dgtic.mejoredu.seguimiento.service.ValidacionService;

@Service
public class ValidacionServiceImpl implements ValidacionService {

  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;
  @Inject
  private ProyectoAnualRepository proyectoAnualRepository;
  @Inject
  private ActividadRepository actividadRepository;
  @Inject
  private ProductoRepository productoRepository;
  @Inject
  private PresupuestoRepository presupuestoRepository;
  @Inject
  private MetValidacionRepository metValidacionRepository;
  @Inject
  private MetRevisionValidacionRepository metRevisionValidacionRepository;
  @Inject
  private MetApartadoRepository metApartadoRepository;
  @Inject
  private MetArchivoValidacionRepository metArchivoValidacionRepository;
  @Inject
  private MetElementoValidarRepository metElementoValidarRepository;
  @Inject
  private ArchivoRepository archivoRepository;
  @Inject
  private ValidacionRubricaRepository validacionRubricaRepository;
  @Inject
  private RubricaRepository rubricaRepository;

  @Override
  @Transactional
  @SneakyThrows
  public RespuestaGenerica guardar(ValidacionDTO peticion) {
    Integer idValidacion = 1;
    RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
    try {
      if (peticion.getApartado() == null) {
        throw new BadRequestException("El apartado no puede ser nulo");
      }
      if (peticion.getCveUsuario() == null) {
        throw new BadRequestException("La clave de usuario  no puede ser nula");
      }
      if (peticion.getId() == null) {
        throw new BadRequestException("El id no puede ser nulo");
      }
      Log.info("peticion.getCveUsuario() " + peticion.getCveUsuario());

      Usuario usuario = usuarioRepository.findById(peticion.getCveUsuario());
      if (usuario == null)
        return new RespuestaGenerica("500", "El usuario no existe, favor de validar.");

      Log.info("peticion.getApartado() " + peticion.getApartado());
      switch (peticion.getApartado()) {
        case "VALIDACION-CORTO-PLAZO":
          Log.info("Entrando a VALIDACION-CORTO-PLAZO");
          var producto = productoRepository.findById(peticion.getId());
          // var proyecto = proyectoAnualRepository.findById(peticion.getId());
          if (producto == null)
            throw new BadRequestException("El id no existe, favor de validar.");
          switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
            case 5: // Supervisor
              Log.info("peticion para usuario Supervisor");
              idValidacion = producto.getIdValidacionSupervisor();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idProyecto  " + peticion.getId());
              var metValidacionS = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacionS.getIdValidacion());
              producto.setIdValidacionSupervisor(metValidacionS.getIdValidacion());
              productoRepository.persistAndFlush(producto);

              createOrReplaceValidationElements(peticion, metValidacionS);

              createOrReplaceValidationFile(peticion, metValidacionS, usuario);
              break;
            case 6: // Planeacion
              Log.info("peticion para usuario de Planeacion");
              idValidacion = producto.getIdValidacionPlaneacion();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
              var metValidacion = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
              producto.setIdValidacionPlaneacion(metValidacion.getIdValidacion());
              productoRepository.persistAndFlush(producto);

              createOrReplaceValidationElements(peticion, metValidacion);
              // Registrar rubrica
              this.registrarRubrica(peticion, metValidacion);
              break;
            case 7: // Presupuesto
              Log.info("peticion para usuario de Presupuesto");
              idValidacion = producto.getIdValidacion();
              Log.info("Proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
              var metValidacionP = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacionP.getIdValidacion());
              producto.setIdValidacion(metValidacionP.getIdValidacion());
              productoRepository.persistAndFlush(producto);

              createOrReplaceValidationElements(peticion, metValidacionP);
              break;
            default:
              throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }

          break;

        case "REVISION-CP-PROYECTOS":
          Log.info("Entrando a REVISION-CP-PROYECTOS");

          var proyecto = proyectoAnualRepository.findById(peticion.getId());
          if (proyecto == null)
            throw new BadRequestException("El id no existe, favor de validar.");
          switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
            case 5:
              Log.info("peticion para usuario Supervisor");
              idValidacion = proyecto.getIdValidacionSupervisor();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idProyecto  " + peticion.getId());
              var metValidacion = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
              proyecto.setIdValidacionSupervisor(metValidacion.getIdValidacion());
              proyectoAnualRepository.persistAndFlush(proyecto);

              createOrReplaceValidationElements(peticion, metValidacion);

              createOrReplaceValidationFile(peticion, metValidacion, usuario);
              break;
            case 6:
              Log.info("peticion para usuario de Planeacion");
              idValidacion = proyecto.getIdValidacionPlaneacion();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
              var metValidacionP = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacionP.getIdValidacion());
              proyecto.setIdValidacionPlaneacion(metValidacionP.getIdValidacion());
              proyectoAnualRepository.persistAndFlush(proyecto);

              createOrReplaceValidationElements(peticion, metValidacionP);
              break;
            case 7:
              Log.info("peticion para usuario de Presupuesto");
              idValidacion = proyecto.getIdValidacion();
              Log.info("Proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idObjetivo  " + peticion.getId());
              var metValidacionPP = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacionPP.getIdValidacion());
              proyecto.setIdValidacion(metValidacionPP.getIdValidacion());
              proyectoAnualRepository.persistAndFlush(proyecto);

              createOrReplaceValidationElements(peticion, metValidacionPP);
              break;
            default:
              throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }

          break;

        case "REVISION-CP-ACTIVIDADES":
          Log.info("Entrando a REVISION-CP-ACTIVIDADES");

          var actividad = actividadRepository.findById(peticion.getId());
          if (actividad == null)
            throw new BadRequestException("El id no existe, favor de validar.");
          switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
            case 5:
              Log.info("peticion para usuario Supervisor");
              idValidacion = actividad.getIdValidacion();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idProyecto  " + peticion.getId());
              var metValidacion = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
              actividad.setIdValidacion(metValidacion.getIdValidacion());
              actividadRepository.persistAndFlush(actividad);

              createOrReplaceValidationElements(peticion, metValidacion);
              createOrReplaceValidationFile(peticion, metValidacion, usuario);
              break;

            default:
              throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }

          break;

        case "REVISION-CP-PRODUCTOS":
          Log.info("Entrando a REVISION-CP-PRODUCTOS");

          producto = productoRepository.findById(peticion.getId());
          if (producto == null)
            throw new BadRequestException("El id no existe, favor de validar.");
          switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
            case 5:
              Log.info("peticion para usuario Supervisor");
              idValidacion = producto.getIdValidacionSupervisor();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idProyecto  " + peticion.getId());
              var metValidacion = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
              producto.setIdValidacionSupervisor(metValidacion.getIdValidacion());
              productoRepository.persistAndFlush(producto);

              createOrReplaceValidationElements(peticion, metValidacion);
              createOrReplaceValidationFile(peticion, metValidacion, usuario);
              break;

            default:
              throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }

          break;

        case "REVISION-CP-PRESUPUESTOS":
          Log.info("Entrando a REVISION-CP-PRESUPUESTOS");

          var presupuesto = presupuestoRepository.findById(peticion.getId());
          if (presupuesto == null)
            throw new BadRequestException("El id no existe, favor de validar.");
          switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
            case 5:
              Log.info("peticion para usuario Supervisor");
              idValidacion = presupuesto.getIdValidacionSupervisor();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              Log.info("El idValidacion viene nulo para este idProyecto  " + peticion.getId());
              var metValidacion = createOrUpdateValidation(peticion, idValidacion);
              Log.info("metValidacion.getIdValidacion()  " + metValidacion.getIdValidacion());
              presupuesto.setIdValidacionSupervisor(metValidacion.getIdValidacion());
              presupuestoRepository.persistAndFlush(presupuesto);

              createOrReplaceValidationElements(peticion, metValidacion);
              createOrReplaceValidationFile(peticion, metValidacion, usuario);
              break;

            default:
              throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }

          break;

        default:
          Log.info("Este apartado no esta considerado");
          throw new BadRequestException("Este apartado no esta considerado en esta solucion");
      }

    } catch (Exception e) {
      respuesta = new RespuestaGenerica("400", "Error en la petición: " + e.getMessage());
    }
    return respuesta;
  }

  private void registrarRubrica(ValidacionDTO peticion, MetValidacionEntity metValidacion) {
    // Elimna y luego agrega la rubrica

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

  public MensajePersonalizado<ValidacionDTO> consultarRevision(String apartado, Integer id, String rol) {
    MensajePersonalizado<ValidacionDTO> respuesta = new MensajePersonalizado<ValidacionDTO>();
    var variasRevisiones = new ArrayList<Revision>();
    respuesta.setCodigo("200");
    respuesta.setMensaje("Exitoso");
    Integer idValidacion = 1;
    switch (apartado) {
      case "VALIDACION-CORTO-PLAZO":
        Log.info("Entrando a VALIDACION-CORTO-PLAZO");
        var producto = productoRepository.findById(id);
        if (producto == null)
          throw new BadRequestException("El idProducto no existe, favor de validar.");

        switch (rol) {
          case "ENLACE":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de ENLACE");
            idValidacion = producto.getIdValidacionPlaneacion();
            if (idValidacion == null) {
              throw new BadRequestException(
                  "Planeacion aún no ha hecho ninguna revision para este id de producto " + id);
            }
            Log.info("proyecto.getIdValidacion() " + idValidacion);

            Integer idValidacionPresupuesto = producto.getIdValidacion();
            List<MetRevisionValidacionEntity> revisionesPresupuesto = metRevisionValidacionRepository
                .find("idValidacion", idValidacionPresupuesto).list();

            revisionesPresupuesto.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            Integer idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
            List<MetRevisionValidacionEntity> revisionesPlaneacion = metRevisionValidacionRepository
                .find("idValidacion", idValidacionPlaneacion).list();

            revisionesPlaneacion.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            break;
          case "PRESUPUESTO":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de PRESUPUESTO");
            idValidacion = producto.getIdValidacion();
            if (idValidacion == null || idValidacion == 0) {
              throw new BadRequestException(
                  "Presupuesto aún no ha hecho ninguna revision para este id de producto " + id);
            }
            Log.info("proyecto.getIdValidacion() " + idValidacion);

            idValidacionPresupuesto = producto.getIdValidacion();
            revisionesPresupuesto = metRevisionValidacionRepository.find("idValidacion", idValidacionPresupuesto)
                .list();

            revisionesPresupuesto.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
            revisionesPlaneacion = metRevisionValidacionRepository.find("idValidacion", idValidacionPlaneacion)
                .list();

            revisionesPlaneacion.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            break;
          case "PLANEACION":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de PLANEACION");
            idValidacion = producto.getIdValidacionPlaneacion();
            if (idValidacion == null) {
              throw new BadRequestException(
                  "Planeacion aún no ha hecho ninguna revision para este id de producto " + id);
            }
            Log.info("proyecto.getIdValidacion() " + idValidacion);

            idValidacionPresupuesto = producto.getIdValidacion();
            revisionesPresupuesto = metRevisionValidacionRepository.find("idValidacion", idValidacionPresupuesto)
                .list();

            revisionesPresupuesto.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
            revisionesPlaneacion = metRevisionValidacionRepository.find("idValidacion", idValidacionPlaneacion)
                .list();

            revisionesPlaneacion.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            break;
          case "SUPERVISOR":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de SUPERVISOR");
            idValidacion = producto.getIdValidacionSupervisor();
            if (idValidacion == null) {
              throw new BadRequestException(
                  "El supervisor aún no ha hecho ninguna revision para este id de producto " + id);
            }
            Log.info("proyecto.getIdValidacion() " + idValidacion);

            List<MetRevisionValidacionEntity> revisiones = metRevisionValidacionRepository
                .find("idValidacion", idValidacion).list();

            revisiones.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            idValidacionPresupuesto = producto.getIdValidacion();
            revisionesPresupuesto = metRevisionValidacionRepository.find("idValidacion", idValidacionPresupuesto)
                .list();

            revisionesPresupuesto.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
            revisionesPlaneacion = metRevisionValidacionRepository.find("idValidacion", idValidacionPlaneacion)
                .list();

            revisionesPlaneacion.stream().map(revision -> {
              Revision rev = new Revision();
              rev.setIdElemento(revision.getIdElementoValidar());
              rev.setComentarios(revision.getCxComentario());
              rev.setCheck(revision.getIxCheck());

              return rev;
            }).forEach(variasRevisiones::add);

            break;

          default:
            Log.info("Este apartado no esta considerado");
            throw new BadRequestException("Este ROL no tiene los permisos necesarios");
        }

        Log.info("IdValidacion de busqueda() " + idValidacion);

        Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
        var numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
        var tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());
        var validacion = metValidacionRepository.findById(idValidacion);
        Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());
        ValidacionDTO validacionDTO = new ValidacionDTO();
        validacionDTO.setApartado(tipoDeApartado.getCxNombre());
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);
        validacionDTO.setRevision(variasRevisiones);

        PanacheQuery<MetArchivoValidacionEntity> encontrarArchivo = metArchivoValidacionRepository
            .find("idValidacion", idValidacion);
        if (encontrarArchivo.list().size() > 0) {
          Log.info(" encontrarArchivo.getIdArchivo()  " + encontrarArchivo.list().get(0).getIdArchivo());
          var archivoEncontrado = archivoRepository.findById(encontrarArchivo.list().get(0).getIdArchivo());
          Log.info(" archivoEncontrado.getIdArchivo()  " + archivoEncontrado.getIdArchivo());

          ArrayList<ArchivoDTO> lstArchivo = new ArrayList<ArchivoDTO>();
          ArchivoDTO archivo = new ArchivoDTO();
          archivo.setIdArchivo(archivoEncontrado.getIdArchivo());
          archivo.setCsEstatus(archivoEncontrado.getEstatus());
          archivo.setCveUsuario(archivoEncontrado.getUsuario().getCveUsuario());
          archivo.setCxNombre(archivoEncontrado.getNombre());
          archivo.setCxUuid(archivoEncontrado.getUuid());
          archivo.setDfFechaCarga(archivoEncontrado.getFechaCarga());
          archivo.setDfHoraCarga(archivoEncontrado.getHoraCarga());
          archivo.setCxUuidToPdf(archivoEncontrado.getUuidToPdf());
          lstArchivo.add(archivo);
          validacionDTO.setArchivos(lstArchivo);
        }

        respuesta.setRespuesta(validacionDTO);

        break;
      case "REVISION-CP-PROYECTOS":
        Log.info("Entrando a REVISION-CP-PROYECTOS");

        var proyecto = proyectoAnualRepository.findById(id);
        if (proyecto == null)
          throw new BadRequestException("El idProyecto no existe, favor de validar.");

        switch (rol) {
          case "PRESUPUESTO":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de PRESUPUESTO");
            idValidacion = proyecto.getIdValidacion();
            if (idValidacion == null || idValidacion == 0) {
              throw new BadRequestException(
                  "Presupuesto aún no ha hecho ninguna revision para este id de proyecto " + id);
            }
            Log.info("proyecto.getIdValidacion() " + idValidacion);

            break;
          case "PLANEACION":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de PLANEACION");
            idValidacion = proyecto.getIdValidacionPlaneacion();
            if (idValidacion == null) {
              throw new BadRequestException(
                  "Planeacion aún no ha hecho ninguna revision para este id de proyecto " + id);
            }
            Log.info("proyecto.getIdValidacion() " + idValidacion);

            break;
          case "SUPERVISOR":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de SUPERVISOR");
            idValidacion = proyecto.getIdValidacionSupervisor();
            if (idValidacion == null) {
              throw new BadRequestException(
                  "El supervisor aún no ha hecho ninguna revision para este id de proyecto " + id);
            }
            Log.info("proyecto.getIdValidacion() " + idValidacion);

            break;

          default:
            Log.info("Este apartado no esta considerado");
            throw new BadRequestException("Este ROL no tiene los permisos necesarios");
        }

        Log.info("IdValidacion de busqueda() " + idValidacion);
        List<MetRevisionValidacionEntity> revisiones = metRevisionValidacionRepository
            .find("idValidacion", idValidacion).list();

        revisiones.stream().map(revision -> {
          Revision rev = new Revision();
          rev.setIdElemento(revision.getIdElementoValidar());
          rev.setComentarios(revision.getCxComentario());
          rev.setCheck(revision.getIxCheck());
          return rev;
        }).forEach(variasRevisiones::add);

        Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
        numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
        tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());
        validacion = metValidacionRepository.findById(idValidacion);
        Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());
        validacionDTO = new ValidacionDTO();
        validacionDTO.setApartado(tipoDeApartado.getCxNombre());
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);

        validacionDTO.setRevision(variasRevisiones);

        encontrarArchivo = metArchivoValidacionRepository.find("idValidacion", idValidacion);
        if (encontrarArchivo.list().size() > 0) {
          Log.info(" encontrarArchivo.getIdArchivo()  " + encontrarArchivo.list().get(0).getIdArchivo());
          var archivoEncontrado = archivoRepository.findById(encontrarArchivo.list().get(0).getIdArchivo());
          Log.info(" archivoEncontrado.getIdArchivo()  " + archivoEncontrado.getIdArchivo());

          ArrayList<ArchivoDTO> lstArchivo = new ArrayList<ArchivoDTO>();
          ArchivoDTO archivo = new ArchivoDTO();
          archivo.setIdArchivo(archivoEncontrado.getIdArchivo());
          archivo.setCsEstatus(archivoEncontrado.getEstatus());
          archivo.setCveUsuario(archivoEncontrado.getUsuario().getCveUsuario());
          archivo.setCxNombre(archivoEncontrado.getNombre());
          archivo.setCxUuid(archivoEncontrado.getUuid());
          archivo.setDfFechaCarga(archivoEncontrado.getFechaCarga());
          archivo.setDfHoraCarga(archivoEncontrado.getHoraCarga());
          archivo.setCxUuidToPdf(archivoEncontrado.getUuidToPdf());
          lstArchivo.add(archivo);
          validacionDTO.setArchivos(lstArchivo);
        }

        respuesta.setRespuesta(validacionDTO);
        break;
      case "REVISION-CP-ACTIVIDADES":
        Log.info("Entrando a REVISION-CP-ACTIVIDADESS");

        var actividad = actividadRepository.findById(id);
        if (actividad == null)
          throw new BadRequestException("El idActividades no existe, favor de validar.");
        idValidacion = actividad.getIdValidacion();
        if (idValidacion == null)
          throw new BadRequestException("Aun no existen comentarios que revisar, favor de validar.");

        Log.info("IdValidacion de busqueda() " + idValidacion);
        revisiones = metRevisionValidacionRepository.find("idValidacion", idValidacion).list();

        revisiones.stream().map(revision -> {
          Revision rev = new Revision();
          rev.setIdElemento(revision.getIdElementoValidar());
          rev.setComentarios(revision.getCxComentario());
          rev.setCheck(revision.getIxCheck());
          return rev;
        }).forEach(variasRevisiones::add);

        Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
        numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
        tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());
        validacion = metValidacionRepository.findById(idValidacion);
        Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());
        validacionDTO = new ValidacionDTO();
        validacionDTO.setApartado(tipoDeApartado.getCxNombre());
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);

        validacionDTO.setRevision(variasRevisiones);

        encontrarArchivo = metArchivoValidacionRepository.find("idValidacion", idValidacion);
        if (encontrarArchivo.list().size() > 0) {
          Log.info(" encontrarArchivo.getIdArchivo()  " + encontrarArchivo.list().get(0).getIdArchivo());
          var archivoEncontrado = archivoRepository.findById(encontrarArchivo.list().get(0).getIdArchivo());
          Log.info(" archivoEncontrado.getIdArchivo()  " + archivoEncontrado.getIdArchivo());

          ArrayList<ArchivoDTO> lstArchivo = new ArrayList<ArchivoDTO>();
          ArchivoDTO archivo = new ArchivoDTO();
          archivo.setIdArchivo(archivoEncontrado.getIdArchivo());
          archivo.setCsEstatus(archivoEncontrado.getEstatus());
          archivo.setCveUsuario(archivoEncontrado.getUsuario().getCveUsuario());
          archivo.setCxNombre(archivoEncontrado.getNombre());
          archivo.setCxUuid(archivoEncontrado.getUuid());
          archivo.setDfFechaCarga(archivoEncontrado.getFechaCarga());
          archivo.setDfHoraCarga(archivoEncontrado.getHoraCarga());
          archivo.setCxUuidToPdf(archivoEncontrado.getUuidToPdf());
          lstArchivo.add(archivo);
          validacionDTO.setArchivos(lstArchivo);
        }

        respuesta.setRespuesta(validacionDTO);
        break;

      case "REVISION-CP-PRODUCTOS":
        Log.info("Entrando a REVISION-CP-PRODUCTOS");

        producto = productoRepository.findById(id);
        if (producto == null)
          throw new BadRequestException("El idProyecto no existe, favor de validar.");
        idValidacion = producto.getIdValidacionSupervisor();

        Log.info("IdValidacion de busqueda() " + idValidacion);
        revisiones = metRevisionValidacionRepository.find("idValidacion", idValidacion).list();

        revisiones.stream().map(revision -> {
          Revision rev = new Revision();
          rev.setIdElemento(revision.getIdElementoValidar());
          rev.setComentarios(revision.getCxComentario());
          rev.setCheck(revision.getIxCheck());
          return rev;
        }).forEach(variasRevisiones::add);

        Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
        numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
        tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());
        validacion = metValidacionRepository.findById(idValidacion);
        Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());
        validacionDTO = new ValidacionDTO();
        validacionDTO.setApartado(tipoDeApartado.getCxNombre());
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);

        validacionDTO.setRevision(variasRevisiones);

        encontrarArchivo = metArchivoValidacionRepository.find("idValidacion", idValidacion);
        if (encontrarArchivo.list().size() > 0) {
          Log.info(" encontrarArchivo.getIdArchivo()  " + encontrarArchivo.list().get(0).getIdArchivo());
          var archivoEncontrado = archivoRepository.findById(encontrarArchivo.list().get(0).getIdArchivo());
          Log.info(" archivoEncontrado.getIdArchivo()  " + archivoEncontrado.getIdArchivo());

          ArrayList<ArchivoDTO> lstArchivo = new ArrayList<ArchivoDTO>();
          ArchivoDTO archivo = new ArchivoDTO();
          archivo.setIdArchivo(archivoEncontrado.getIdArchivo());
          archivo.setCsEstatus(archivoEncontrado.getEstatus());
          archivo.setCveUsuario(archivoEncontrado.getUsuario().getCveUsuario());
          archivo.setCxNombre(archivoEncontrado.getNombre());
          archivo.setCxUuid(archivoEncontrado.getUuid());
          archivo.setDfFechaCarga(archivoEncontrado.getFechaCarga());
          archivo.setDfHoraCarga(archivoEncontrado.getHoraCarga());
          archivo.setCxUuidToPdf(archivoEncontrado.getUuidToPdf());
          lstArchivo.add(archivo);
          validacionDTO.setArchivos(lstArchivo);
        }

        respuesta.setRespuesta(validacionDTO);
        break;

      case "REVISION-CP-PRESUPUESTOS":
        Log.info("Entrando a REVISION-CP-PRESUPUESTOS");

        var presupuesto = presupuestoRepository.findById(id);
        if (presupuesto == null)
          throw new BadRequestException("El idProyecto no existe, favor de validar.");
        idValidacion = presupuesto.getIdValidacionSupervisor();

        Log.info("IdValidacion de busqueda() " + idValidacion);
        revisiones = metRevisionValidacionRepository.find("idValidacion", idValidacion).list();

        revisiones.stream().map(revision -> {
          Revision rev = new Revision();
          rev.setIdElemento(revision.getIdElementoValidar());
          rev.setComentarios(revision.getCxComentario());
          rev.setCheck(revision.getIxCheck());
          return rev;
        }).forEach(variasRevisiones::add);

        Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
        numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
        tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());
        validacion = metValidacionRepository.findById(idValidacion);
        Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());
        validacionDTO = new ValidacionDTO();
        validacionDTO.setApartado(tipoDeApartado.getCxNombre());
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);

        validacionDTO.setRevision(variasRevisiones);

        encontrarArchivo = metArchivoValidacionRepository.find("idValidacion", idValidacion);
        if (encontrarArchivo.list().size() > 0) {
          Log.info(" encontrarArchivo.getIdArchivo()  " + encontrarArchivo.list().get(0).getIdArchivo());
          var archivoEncontrado = archivoRepository.findById(encontrarArchivo.list().get(0).getIdArchivo());
          Log.info(" archivoEncontrado.getIdArchivo()  " + archivoEncontrado.getIdArchivo());

          ArrayList<ArchivoDTO> lstArchivo = new ArrayList<ArchivoDTO>();
          ArchivoDTO archivo = new ArchivoDTO();
          archivo.setIdArchivo(archivoEncontrado.getIdArchivo());
          archivo.setCsEstatus(archivoEncontrado.getEstatus());
          archivo.setCveUsuario(archivoEncontrado.getUsuario().getCveUsuario());
          archivo.setCxNombre(archivoEncontrado.getNombre());
          archivo.setCxUuid(archivoEncontrado.getUuid());
          archivo.setDfFechaCarga(archivoEncontrado.getFechaCarga());
          archivo.setDfHoraCarga(archivoEncontrado.getHoraCarga());
          archivo.setCxUuidToPdf(archivoEncontrado.getUuidToPdf());
          lstArchivo.add(archivo);
          validacionDTO.setArchivos(lstArchivo);
        }

        respuesta.setRespuesta(validacionDTO);
        break;

      default:
        Log.info("Este apartado no esta considerado");
        throw new BadRequestException("Este ROL no tiene los permisos necesarios");
    }
    return respuesta;
  }

  private Archivo entityFromDTO(ArchivoDTO archivoDTO, Usuario user) {
    if (archivoDTO.getCxUuid() == null || archivoDTO.getCxUuid().isBlank()) {
      throw new BadRequestException("El campo cxUuid es requerido");
    }
    if (archivoDTO.getCsEstatus() == null || archivoDTO.getCsEstatus().isBlank()) {
      throw new BadRequestException("El campo csEstatus es requerido");
    }

    var archivo = new Archivo();

    archivo.setEstatus(archivoDTO.getCsEstatus());
    archivo.setNombre(archivoDTO.getCxNombre());
    archivo.setUsuario(user);
    archivo.setUuid(archivoDTO.getCxUuid());
    archivo.setUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
    archivo.setFechaCarga(LocalDate.now());
    archivo.setHoraCarga(LocalTime.now());

    var tipoDocumento = new TipoDocumento();
    tipoDocumento.setIdTipoDocumento(1);
    archivo.setTipoDocumento(tipoDocumento);

    return archivo;
  }

  private ArchivoDTO entityToDTO(Archivo archivo) {
    var archivoDTO = new ArchivoDTO();

    archivoDTO.setIdArchivo(archivo.getIdArchivo());
    archivoDTO.setCsEstatus(archivo.getEstatus());
    archivoDTO.setCveUsuario(archivo.getUsuario().getCveUsuario());
    archivoDTO.setCxNombre(archivo.getNombre());
    archivoDTO.setCxUuid(archivo.getUuid());
    archivoDTO.setDfFechaCarga(archivo.getFechaCarga());
    archivoDTO.setDfHoraCarga(archivo.getHoraCarga());
    archivoDTO.setCxUuidToPdf(archivo.getUuidToPdf());

    return archivoDTO;
  }

  /**
   * Crea o reemplaza el archivo de validación, además de asignar el archivo al perfil laboral del usuario que realiza la validación.
   *
   * @param peticion
   * @param validacion
   * @param user
   */
  private void createOrReplaceValidationFile(ValidacionDTO peticion, MetValidacionEntity validacion, Usuario user) {
    if (peticion.getArchivos() == null || peticion.getArchivos().isEmpty()) {
      Log.info("Esta petición no tiene archivos");
      return;
    }

    var archivoDTO = peticion.getArchivos().get(0);
    var archivo = entityFromDTO(archivoDTO, user);
    archivoRepository.persistAndFlush(archivo);

    perfilLaboralRepository.findByCveUsuario(user.getCveUsuario())
        .ifPresent(perfilLaboral -> {
          perfilLaboral.setIdArchivo(archivo.getIdArchivo());
          perfilLaboralRepository.persist(perfilLaboral);
        });

    Log.info("Eliminando archivos de validación previos");
    metArchivoValidacionRepository.delete("idValidacion", validacion.getIdValidacion());
    var archivoNuevo = archivoRepository
        .find("cxUuid", archivoDTO.getCxUuid()).firstResultOptional()
        .orElseThrow(() -> new NotFoundException("No se encontró el archivo con uuid "
            + archivoDTO.getCxUuid()));

    Log.info("Asignando archivo a validación");
    var metArchivoValidacion = new MetArchivoValidacionEntity();
    metArchivoValidacion.setIdArchivo(archivoNuevo.getIdArchivo());
    metArchivoValidacion.setIdValidacion(validacion.getIdValidacion());

    metArchivoValidacionRepository.persistAndFlush(metArchivoValidacion);
  }

  private void createOrReplaceValidationElements(ValidacionDTO peticion, MetValidacionEntity validacion) {
    metRevisionValidacionRepository.delete("idValidacion", validacion.getIdValidacion());
    var elementosEnRevision = new ArrayList<MetRevisionValidacionEntity>();

    peticion.getRevision().stream().map(el -> {
      MetRevisionValidacionEntity revision = new MetRevisionValidacionEntity();
      revision.setIxCheck(el.getCheck());
      revision.setCxComentario(el.getComentarios());
      revision.setIdElementoValidar(el.getIdElemento());
      revision.setIdValidacion(validacion.getIdValidacion());
      return revision;
    }).forEach(elementosEnRevision::add);
    metRevisionValidacionRepository.persist(elementosEnRevision);
  }

  private MetValidacionEntity createOrUpdateValidation(ValidacionDTO peticion, Integer validationId) {
    var validation = (validationId != null && validationId != 0)
        ? metValidacionRepository.findByIdOptional(validationId)
        .orElseThrow(() -> new BadRequestException("No se encontró la validación con id " + validationId))
        : new MetValidacionEntity();

    validation.setDfValidacion(LocalDate.now());
    validation.setDhValidacion(LocalTime.now());
    validation.setCveUsuarioRegistra(peticion.getCveUsuario());
    validation.setCveUsuarioActualiza(peticion.getCveUsuario());
    validation.setCsEstatus(peticion.getEstatus());

    metValidacionRepository.persistAndFlush(validation);

    return validation;
  }
}
