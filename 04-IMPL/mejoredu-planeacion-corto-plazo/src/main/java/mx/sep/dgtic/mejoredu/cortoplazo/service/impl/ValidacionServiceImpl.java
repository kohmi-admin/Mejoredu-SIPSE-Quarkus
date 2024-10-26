package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import lombok.SneakyThrows;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.cortoplazo.RubricaDTO;
import mx.sep.dgtic.mejoredu.cortoplazo.VTProyectoApartadoEstatusDTO;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.*;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.*;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ValidacionService;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.Revision;
import mx.sep.dgtic.mejoredu.cortoplazo.ValidacionDTO;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

  @Inject
  private VTProyectoApartadoEstatusRepository vtProyectoApartadoEstatusRepository;

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
          if (producto == null)
            throw new BadRequestException("El id no existe, favor de validar.");

          // Ajustar estatus del proyecto dependiendo de los comentarios en otros
          // apartados
          this.actualizarEstatusProyecto(peticion, peticion.getEstatus(),
              usuario.getTipoUsuario().getIdTipoUsuario(), producto);

          switch (usuario.getTipoUsuario().getIdTipoUsuario()) {
            case 5: // Supervisor
              Log.info("peticion para usuario Supervisor");
              idValidacion = producto.getIdValidacionSupervisor();
              Log.info("proyecto.getIdValidacion() " + idValidacion);
              var validation = createOrUpdateValidation(peticion, idValidacion);

              producto.setIdValidacionSupervisor(validation.getIdValidacion());
              productoRepository.persistAndFlush(producto);

              createOrReplaceValidationElements(peticion, validation);
              createOrReplaceValidationFile(peticion, validation, usuario);
              break;
            case 6: // Planeacion
              Log.info("peticion para usuario de Planeacion");
              idValidacion = producto.getIdValidacionPlaneacion();
              Log.info("proyecto.getIdValidacion() " + idValidacion);

              var validationP = createOrUpdateValidation(peticion, idValidacion);

              producto.setIdValidacionPlaneacion(validationP.getIdValidacion());
              productoRepository.persistAndFlush(producto);

              createOrReplaceValidationElements(peticion, validationP);
              createOrReplaceValidationFile(peticion, validationP, usuario);
              registrarRubrica(peticion, validationP);
              break;
            case 7: // Presupuesto
              Log.info("peticion para usuario de Presupuesto");
              idValidacion = producto.getIdValidacion();
              Log.info("Proyecto.getIdValidacion() " + idValidacion);

              var validationPP = createOrUpdateValidation(peticion, idValidacion);

              producto.setIdValidacion(validationPP.getIdValidacion());
              productoRepository.persistAndFlush(producto);

              createOrReplaceValidationElements(peticion, validationPP);
              createOrReplaceValidationFile(peticion, validationPP, usuario);
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

              var validation = createOrUpdateValidation(peticion, idValidacion);

              proyecto.setIdValidacionSupervisor(validation.getIdValidacion());
              proyecto.setCsEstatus(peticion.getEstatus());
              proyectoAnualRepository.persistAndFlush(proyecto);

              createOrReplaceValidationElements(peticion, validation);
              createOrReplaceValidationFile(peticion, validation, usuario);
              break;
            case 6:
              Log.info("peticion para usuario de Planeacion");
              idValidacion = proyecto.getIdValidacionPlaneacion();
              Log.info("proyecto.getIdValidacion() " + idValidacion);

              var validationP = createOrUpdateValidation(peticion, idValidacion);

              proyecto.setIdValidacionPlaneacion(validationP.getIdValidacion());
              proyecto.setCsEstatus(peticion.getEstatus());
              proyectoAnualRepository.persistAndFlush(proyecto);

              createOrReplaceValidationElements(peticion, validationP);
              createOrReplaceValidationFile(peticion, validationP, usuario);
              break;
            case 7:
              Log.info("peticion para usuario de Presupuesto");
              idValidacion = proyecto.getIdValidacion();
              Log.info("Proyecto.getIdValidacion() " + idValidacion);

              var validationPP = createOrUpdateValidation(peticion, idValidacion);

              proyecto.setIdValidacion(validationPP.getIdValidacion());
              proyecto.setCsEstatus(peticion.getEstatus());
              proyectoAnualRepository.persistAndFlush(proyecto);

              createOrReplaceValidationElements(peticion, validationPP);
              createOrReplaceValidationFile(peticion, validationPP, usuario);
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
          if (!usuario.hasValidationPermission()) {
            throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }

          Log.info("peticion para usuario Supervisor");
          idValidacion = actividad.getIdValidacionSupervisor();
          Log.info("proyecto.getIdValidacion() " + idValidacion);

          var validation = createOrUpdateValidation(peticion, idValidacion);

          actividad.setIdValidacionSupervisor(validation.getIdValidacion());
          actividadRepository.persistAndFlush(actividad);

          createOrReplaceValidationElements(peticion, validation);
          createOrReplaceValidationFile(peticion, validation, usuario);
          break;

        case "REVISION-CP-PRODUCTOS":
          Log.info("Entrando a REVISION-CP-PRODUCTOS");

          var productoP = productoRepository.findById(peticion.getId());
          if (productoP == null)
            throw new BadRequestException("El id no existe, favor de validar.");

          if (!usuario.hasValidationPermission()) {
            throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }

          Log.info("peticion para usuario Supervisor");
          idValidacion = productoP.getIdValidacionSupervisor();
          Log.info("proyecto.getIdValidacion() " + idValidacion);
          var validationP = createOrUpdateValidation(peticion, idValidacion);

          productoP.setIdValidacionSupervisor(validationP.getIdValidacion());
          productoRepository.persistAndFlush(productoP);

          createOrReplaceValidationElements(peticion, validationP);
          createOrReplaceValidationFile(peticion, validationP, usuario);
          break;

        case "REVISION-CP-PRESUPUESTOS":
          Log.info("Entrando a REVISION-CP-PRESUPUESTOS");

          var presupuesto = presupuestoRepository.findById(peticion.getId());
          Log.info("presupuesto : " + peticion.getId());
          if (presupuesto == null)
            throw new BadRequestException("El id no existe, favor de validar.");

          // Validar si los estatus de los apartados anteriores están completos y listos
          // para aprobar
          // En caso de ser estatus de aprobación

          // A solicitud de Natali, se eliminan la validación de ciclos de revisión y se
          // hará multi-revisiones el front controla el estatus
          // *******************************************************************************************************************************
//				if (EstatusEnum.APROBADO.getEstatus().equals(peticion.getEstatus())) {
//					List<VTProyectoApartadoEstatusDTO> lstApartadosPorCompletar = this.validarEstatusParaAprobar(
//							presupuesto.getProducto().getActividad().getProyectoAnual().getIdProyecto());
//					if (lstApartadosPorCompletar.size() > 0) {
//						final StringBuilder apartados = new StringBuilder();
//
//						lstApartadosPorCompletar.forEach((val) -> {
//							apartados.append(val.getApartado() + ",");
//						});
//
//						String apartadosConcatenados = apartados.toString();
//
//						/*
//						 * throw new BadRequestException(
//						 * 
//						 * "No es posible finalizar por no contar con los estutus completos en los apartados :"
//						 * + apartadosConcatenados);
//						 */
//						
//						//Cambiar en automatico el estatus para avanzarlo segun corresponda
//						//Checar que estatus tiene ciclo
//						ProyectoAnual proyectoAnal =  presupuesto.getProducto().getActividad().getProyectoAnual();
//						String estatusCalculado = proyectoAnal.getCsEstatus();
//						if (proyectoAnal.getIxCicloValidacion()<3 || proyectoAnal.getIxCicloValidacion() == null) {
//							estatusCalculado = (proyectoAnal.getIxCicloValidacion()+1)+"";
//						}else if (proyectoAnal.getIxCicloValidacion()==3) {
//							estatusCalculado = EstatusEnum.RECHAZADO.getEstatus();
//						}
//						peticion.setEstatus( estatusCalculado );
//					}
//				}
          // Registrar cambio de estatus al proyecto dependiendo del cambio solicitado
          String respuestaActualizarestatus = this.actualizarEstatusProyecto(peticion, peticion.getEstatus(),
              usuario.getTipoUsuario().getIdTipoUsuario(), presupuesto.getProducto());
          respuesta = new RespuestaGenerica("200", "Exitoso. " + respuestaActualizarestatus);

          if (!usuario.hasValidationPermission()) {
            throw new BadRequestException("Este usuario no tiene los permisos necesarios ");
          }
          Log.info("peticion para usuario Supervisor");
          idValidacion = presupuesto.getIdValidacionSupervisor();
          Log.info("proyecto.getIdValidacion() " + idValidacion);
          var validationS = createOrUpdateValidation(peticion, idValidacion);

          presupuesto.setIdValidacionSupervisor(validationS.getIdValidacion());
          presupuestoRepository.persistAndFlush(presupuesto);

          createOrReplaceValidationElements(peticion, validationS);
          createOrReplaceValidationFile(peticion, validationS, usuario);
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

  private String actualizarEstatusProyecto(ValidacionDTO peticion, String estatus, Integer rol, Producto producto) {
    var proyecto = proyectoAnualRepository.findById(producto.getActividad().getProyectoAnual().getIdProyecto());
    MetValidacionEntity validacion = new MetValidacionEntity();
    validacion.setCveUsuarioRegistra(peticion.getCveUsuario());
    validacion.setDfValidacion(LocalDate.now());
    validacion.setDhValidacion(LocalTime.now());
    String respuesta = "";
    validacion.setIxCiclo(1);
    if (rol >= TipoUsuarioEnum.SUPERVISOR.getIdTipoUsuario()
        && rol <= TipoUsuarioEnum.PRESUPUESTO.getIdTipoUsuario()) { // 5 al 7
      switch (rol) {
        case 6:
          if (proyecto.getIdValidacionPlaneacion() != null)
            validacion = metValidacionRepository.findById(proyecto.getIdValidacionPlaneacion());

          break;
        case 7:
          if (proyecto.getIdValidacion() != null)
            validacion = metValidacionRepository.findById(proyecto.getIdValidacion());
          break;
        case 5:
          if (proyecto.getIdValidacionSupervisor() != null)
            validacion = metValidacionRepository.findById(proyecto.getIdValidacionSupervisor());
          break;

      }
      validacion.setCsEstatus(estatus);

    }
    metValidacionRepository.persistAndFlush(validacion);
    if (rol >= TipoUsuarioEnum.SUPERVISOR.getIdTipoUsuario()
        && rol <= TipoUsuarioEnum.PRESUPUESTO.getIdTipoUsuario()) {
      switch (rol) {
        case 6:
          proyecto.setIdValidacionPlaneacion(validacion.getIdValidacion());

          break;
        case 7:
          proyecto.setIdValidacion(validacion.getIdValidacion());
          break;
        case 5:
          proyecto.setIdValidacionSupervisor(validacion.getIdValidacion());
          break;
      }
      // Asignar ciclo de revisión al proyecto
      if (proyecto.getIxCicloValidacion() == null)
        proyecto.setIxCicloValidacion(1);
      else
        proyecto.setIxCicloValidacion(proyecto.getIxCicloValidacion() + 1); // ********* Incrementa el ciclo
      // proyecto.setIxCicloValidacion(proyecto.getIxCicloValidacion() + 1); // ********* Incrementa el ciclo

      // A solicitud de Natali, se eliminan la validación de ciclos de revisión y se
      // hará multi-revisiones el front controla el estatus
      // *******************************************************************************************************************************
//			if (EstatusEnum.PRIMERAREVISION.getEstatus().equals(estatus)
//					|| EstatusEnum.SEGUNDAREVISION.getEstatus().equals(estatus)
//					|| EstatusEnum.TERCERAREVISION.getEstatus().equals(estatus)) {
//				proyecto.setIxCicloValidacion(Integer.valueOf(estatus));
//				
//				respuesta = "Se ajustó estatus del proyecto a Ciclo de revisión : " + estatus;
//			}else if (EstatusEnum.RECHAZADO.getEstatus().equals(estatus)) {
//				respuesta = "Se ajustó estatus del proyecto a Rechazado, por superar los ciclos de revisión";
//			}
      proyecto.setCsEstatus(estatus);
      Log.info("proyecto : " + proyecto.getIdProyecto());
      proyectoAnualRepository.persistAndFlush(proyecto);

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
    Integer idValidacion = null;
    MetValidacionEntity validacion = new MetValidacionEntity();
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

            revisionesPresupuesto.stream().map(this::entityToDTO)
                .forEach(variasRevisiones::add);

            Integer idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
            List<MetRevisionValidacionEntity> revisionesPlaneacion = metRevisionValidacionRepository
                .find("idValidacion", idValidacionPlaneacion).list();

            revisionesPlaneacion.stream().map(this::entityToDTO)
                .forEach(variasRevisiones::add);

            break;
          case "PRESUPUESTO":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de PRESUPUESTO");
            /*
             * idValidacion = producto.getIdValidacion(); if (idValidacion == null ||
             * idValidacion == 0) { if (producto.getIdValidacionPlaneacion() == null) throw
             * new BadRequestException(
             * "Presupuesto aún no ha hecho ninguna revision para este id de producto " +
             * id); }
             */
            // Log.info("proyecto.getIdValidacion() " + idValidacion);
            if (producto.getIdValidacion() != null) {
              idValidacionPresupuesto = producto.getIdValidacion();
              revisionesPresupuesto = metRevisionValidacionRepository
                  .find("idValidacion", idValidacionPresupuesto).list();

              revisionesPresupuesto.stream().map(this::entityToDTO)
                  .forEach(variasRevisiones::add);
            }
            if (producto.getIdValidacionPlaneacion() != null) {
              idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
              revisionesPlaneacion = metRevisionValidacionRepository.find("idValidacion", idValidacionPlaneacion)
                  .list();

              revisionesPlaneacion.stream().map(this::entityToDTO)
                  .forEach(variasRevisiones::add);
            }
            if (variasRevisiones.isEmpty()) {
              throw new BadRequestException(
                  "Planeacion y Presupuesto aún no ha hecho ninguna revision para este id de producto " + id);
            }
            break;
          case "PLANEACION":
            Log.info("Entrando a VALIDACION-CORTO-PLAZO con el rol de PLANEACION");

            idValidacionPresupuesto = producto.getIdValidacion();
            revisionesPresupuesto = metRevisionValidacionRepository.find("idValidacion", idValidacionPresupuesto)
                .list();

            revisionesPresupuesto.stream().map(this::entityToDTO)
                .forEach(variasRevisiones::add);

            idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
            revisionesPlaneacion = metRevisionValidacionRepository.find("idValidacion", idValidacionPlaneacion)
                .list();

            revisionesPlaneacion.stream().map(this::entityToDTO)
                .forEach(variasRevisiones::add);
            if (variasRevisiones.isEmpty()) {
              throw new BadRequestException(
                  "Planeacion y Presupuesto aún no ha hecho ninguna revision para este id de producto " + id);
            }
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

            revisiones.stream().map(this::entityToDTO)
                .forEach(variasRevisiones::add);

            idValidacionPresupuesto = producto.getIdValidacion();
            revisionesPresupuesto = metRevisionValidacionRepository.find("idValidacion", idValidacionPresupuesto)
                .list();

            revisionesPresupuesto.stream().map(this::entityToDTO)
                .forEach(variasRevisiones::add);

            idValidacionPlaneacion = producto.getIdValidacionPlaneacion();
            revisionesPlaneacion = metRevisionValidacionRepository.find("idValidacion", idValidacionPlaneacion)
                .list();

            revisionesPlaneacion.stream().map(this::entityToDTO)
                .forEach(variasRevisiones::add);

            break;

          default:
            Log.info("Este apartado no esta considerado");
            throw new BadRequestException("Este ROL no tiene los permisos necesarios");
        }

        Log.info("IdValidacion de busqueda() " + idValidacion);
        ValidacionDTO validacionDTO = new ValidacionDTO();

        Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
        var numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
        var tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());

        if (idValidacion != null) {
          validacion = metValidacionRepository.findById(idValidacion);
          Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());
          validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
          validacionDTO.setEstatus(validacion.getCsEstatus());
          validacionDTO.setId(idValidacion);
          validacionDTO.setRubrica(this.consultarRubrica(idValidacion));
        }
        validacionDTO.setApartado(tipoDeApartado.getCxNombre());

        validacionDTO.setRevision(variasRevisiones);
        // Agregar información de la rubrica
        validacionDTO.setRubrica(this.consultarRubrica(producto.getIdValidacionPlaneacion()));

        PanacheQuery<MetArchivoValidacionEntity> encontrarArchivo = metArchivoValidacionRepository
            .find("idValidacion", idValidacion);
        if (encontrarArchivo.list().size() > 0) {
          Log.info(" encontrarArchivo.getIdArchivo()  " + encontrarArchivo.list().get(0).getIdArchivo());
          var archivoEncontrado = archivoRepository.findById(encontrarArchivo.list().get(0).getIdArchivo());
          Log.info(" archivoEncontrado.getIdArchivo()  " + archivoEncontrado.getIdArchivo());

          ArrayList<ArchivoDTO> lstArchivo = new ArrayList<ArchivoDTO>();
          var archivo = entityToDTO(archivoEncontrado);
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
          case "SUPERVISOR", "ENLACE":
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
        Log.info("proyecto  " + proyecto.getIdProyecto());
        Log.info("IdValidacion de busqueda() " + idValidacion);
        List<MetRevisionValidacionEntity> revisiones = metRevisionValidacionRepository
            .find("idValidacion", idValidacion).list();

        revisiones.stream().map(this::entityToDTO)
            .forEach(variasRevisiones::add);

        // Bloque de validaciones
        validacionDTO = new ValidacionDTO();
        // Datos generales de validación
        validacion = metValidacionRepository.findById(idValidacion);
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);
        validacionDTO.setApartado(apartado);

        if (!variasRevisiones.isEmpty()) {
          Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());

          numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
          tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());

          Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());

          validacionDTO.setRevision(variasRevisiones);
          // Agregar información de la rubrica
          validacionDTO.setRubrica(this.consultarRubrica(proyecto.getIdValidacionPlaneacion()));
        }

        var archivoDTO = getFileFromValidationId(idValidacion)
            .map(this::entityToDTO);
        if (archivoDTO.isPresent()) {
          var archivos = new ArrayList<ArchivoDTO>();
          archivos.add(archivoDTO.get());
          validacionDTO.setArchivos(archivos);
        }

        respuesta.setRespuesta(validacionDTO);
        break;
      case "REVISION-CP-ACTIVIDADES":
        Log.info("Entrando a REVISION-CP-ACTIVIDADESS");

        var actividad = actividadRepository.findById(id);
        if (actividad == null)
          throw new BadRequestException("El idActividades no existe, favor de validar.");
        idValidacion = actividad.getIdValidacionSupervisor();
        if (idValidacion == null)
          throw new BadRequestException("Aun no existen comentarios que revisar, favor de validar.");

        Log.info("IdValidacion de busqueda() " + idValidacion);
        revisiones = metRevisionValidacionRepository.find("idValidacion", idValidacion).list();

        revisiones.stream().map(this::entityToDTO)
            .forEach(variasRevisiones::add);

        // Bloque de validaciones
        validacionDTO = new ValidacionDTO();
        // Datos generales de validación
        validacion = metValidacionRepository.findById(idValidacion);
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);
        validacionDTO.setApartado(apartado);

        if (!variasRevisiones.isEmpty()) {
          Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
          numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
          tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());

          Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());

          validacionDTO.setRevision(variasRevisiones);
        }

        var archivoDTOActividades = getFileFromValidationId(idValidacion)
            .map(this::entityToDTO);
        if (archivoDTOActividades.isPresent()) {
          var archivos = new ArrayList<ArchivoDTO>();
          archivos.add(archivoDTOActividades.get());
          validacionDTO.setArchivos(archivos);
        }

        respuesta.setRespuesta(validacionDTO);
        break;

      case "REVISION-CP-PRODUCTOS":
        Log.info("Entrando a REVISION-CP-PRODUCTOS");

        producto = productoRepository.findById(id);
        if (producto == null)
          throw new BadRequestException("El idProyecto no existe, favor de validar.");

        variasRevisiones = getReviews(producto);

        if (producto.getIdValidacionSupervisor() != null) {
          idValidacion = producto.getIdValidacionSupervisor();
        } else if (producto.getIdValidacionPlaneacion() != null) {
          idValidacion = producto.getIdValidacionPlaneacion();
        } else {
          idValidacion = producto.getIdValidacion();
        }

        if (idValidacion == null) {
          throw new BadRequestException(
              "Planeacion, Presupuesto y supervisor aún no ha hecho ninguna revision para este id de producto "
                  + id);
        }

        if (variasRevisiones.isEmpty()) {
          throw new BadRequestException(
              "Planeacion, Presupuesto y supervisor aún no ha hecho ninguna revision para este id de producto "
                  + id);
        }
        // Bloque de validaciones
        validacionDTO = new ValidacionDTO();
        // Datos generales de validación
        validacion = metValidacionRepository.findById(idValidacion);
        validacionDTO.setCveUsuario(validacion.getCveUsuarioRegistra());
        validacionDTO.setEstatus(validacion.getCsEstatus());
        validacionDTO.setId(idValidacion);
        validacionDTO.setApartado(apartado);

        if (!variasRevisiones.isEmpty()) {
          Log.info("variasRevisiones.get(0).getIdElemento()  " + variasRevisiones.get(0).getIdElemento());
          numeroDeApartado = metElementoValidarRepository.findById(variasRevisiones.get(0).getIdElemento());
          tipoDeApartado = metApartadoRepository.findById(numeroDeApartado.getIdApartado());

          Log.info("tipoDeApartado.getCxNombre()  " + tipoDeApartado.getCxNombre());

          validacionDTO.setRevision(variasRevisiones);
          // Agregar información de la rubrica
          validacionDTO.setRubrica(this.consultarRubrica(producto.getIdValidacionPlaneacion()));
        }

        var archivoDTOProductos = getFileFromValidationId(idValidacion)
            .map(this::entityToDTO);
        if (archivoDTOProductos.isPresent()) {
          var archivos = new ArrayList<ArchivoDTO>();
          archivos.add(archivoDTOProductos.get());
          validacionDTO.setArchivos(archivos);
        }


        respuesta.setRespuesta(validacionDTO);
        break;

      case "REVISION-CP-PRESUPUESTOS":
        Log.info("Entrando a REVISION-CP-PRESUPUESTOS");

        var presupuesto = presupuestoRepository.findById(id);
        if (presupuesto == null)
          throw new BadRequestException("El idPresupuesto no existe, favor de validar.");

        variasRevisiones = getReviews(presupuesto);

        if (presupuesto.getIdValidacionSupervisor() != null) {
          idValidacion = presupuesto.getIdValidacionSupervisor();
        } else if (presupuesto.getIdValidacionPlaneacion() != null) {
          idValidacion = presupuesto.getIdValidacionPlaneacion();
        } else {
          idValidacion = presupuesto.getIdValidacion();
        }

        if (idValidacion == null) {
          throw new BadRequestException(
              "Planeacion, Presupuesto y supervisor aún no han hecho ninguna revision para este id de presupuesto "
                  + id);
        }

        if (variasRevisiones.isEmpty()) {
          throw new BadRequestException(
              "Planeacion, Presupuesto y supervisor aún no han hecho ninguna revision para este id de presupuesto "
                  + id);
        }

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
        // Agregar información de la rubrica
        validacionDTO.setRubrica(this.consultarRubrica(presupuesto.getIdValidacionPlaneacion()));

        var archivoDTO2 = getFileFromValidationId(idValidacion)
            .map(this::entityToDTO);
        if (archivoDTO2.isPresent()) {
          var archivos = new ArrayList<ArchivoDTO>();
          archivos.add(archivoDTO2.get());
          validacionDTO.setArchivos(archivos);
        }

        respuesta.setRespuesta(validacionDTO);
        break;

      default:
        Log.info("Este apartado no esta considerado");
        throw new BadRequestException("Este ROL no tiene los permisos necesarios");
    }
    return respuesta;
  }

  @SuppressWarnings("unused")
  private List<VTProyectoApartadoEstatusDTO> validarEstatusParaAprobar(Integer idProyecto) {

    PanacheQuery<VTProyectoApartadoEstatus> apartados = vtProyectoApartadoEstatusRepository
        .find("idProyecto = ?1 and csEstatus not in ('T')", idProyecto); // and apartado != '1 proyecto'

    List<VTProyectoApartadoEstatusDTO> respuesta = new ArrayList<>();

    apartados.list().stream().map(apartado -> {
      VTProyectoApartadoEstatusDTO apartadoDTO = new VTProyectoApartadoEstatusDTO();
      apartadoDTO.setApartado(apartado.getApartado());
      return apartadoDTO;
    }).forEach(respuesta::add);

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

    archivo.setCsEstatus(archivoDTO.getCsEstatus());
    archivo.setCxNombre(archivoDTO.getCxNombre());
    archivo.setUsuario(user);
    archivo.setCxUuid(archivoDTO.getCxUuid());
    archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
    archivo.setDfFechaCarga(LocalDate.now());
    archivo.setDfHoraCarga(LocalTime.now());

    var tipoDocumento = new TipoDocumento();
    tipoDocumento.setIdTipoDocumento(1);
    archivo.setTipoDocumento(tipoDocumento);

    return archivo;
  }

  private ArchivoDTO entityToDTO(Archivo archivo) {
    var archivoDTO = new ArchivoDTO();

    archivoDTO.setIdArchivo(archivo.getIdArchivo());
    archivoDTO.setCsEstatus(archivo.getCsEstatus());
    archivoDTO.setCveUsuario(archivo.getUsuario().getCveUsuario());
    archivoDTO.setCxNombre(archivo.getCxNombre());
    archivoDTO.setCxUuid(archivo.getCxUuid());
    archivoDTO.setDfFechaCarga(archivo.getDfFechaCarga());
    archivoDTO.setDfHoraCarga(archivo.getDfHoraCarga());
    archivoDTO.setCxUuidToPdf(archivo.getCxUuidToPdf());

    return archivoDTO;
  }

  private Optional<Archivo> getFileFromValidationId(Integer validationId) {
    var archivoValidacion = metArchivoValidacionRepository.find("idValidacion", validationId)
        .firstResultOptional();

    if (archivoValidacion.isEmpty()) {
      return Optional.empty();
    }

    return archivoRepository.findByIdOptional(archivoValidacion.get().getIdArchivo());
  }

  private Revision entityToDTO(MetRevisionValidacionEntity revision) {
    var revisionDTO = new Revision();

    revisionDTO.setIdElemento(revision.getIdElementoValidar());
    revisionDTO.setComentarios(revision.getCxComentario());
    revisionDTO.setCheck(revision.getIxCheck());

    return revisionDTO;
  }

  /**
   * Crea o reemplaza el archivo de validación, además de asignar el archivo al perfil laboral del usuario que realiza la validación.
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
          perfilLaboral.setArchivoFirma(archivo);
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

  private ArrayList<Revision> getReviews(ValidableBase validable) {
    List<Integer> validations = new ArrayList<>();

    if (validable.getIdValidacion() != null) {
      validations.add(validable.getIdValidacion());
    }

    if (validable.getIdValidacionPlaneacion() != null) {
      validations.add(validable.getIdValidacionPlaneacion());
    }

    if (validable.getIdValidacionSupervisor() != null) {
      validations.add(validable.getIdValidacionSupervisor());
    }

    var reviews = new ArrayList<Revision>();
    var revisiones = metRevisionValidacionRepository.find("idValidacion IN ?1", validations).list();
    revisiones.stream().map(this::entityToDTO)
        .forEach(reviews::add);
    return reviews;
  }
}
