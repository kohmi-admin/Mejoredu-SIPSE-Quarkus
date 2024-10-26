package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import lombok.SneakyThrows;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.*;
import mx.edu.sep.dgtic.mejoredu.rest.client.model.ResponseCreateFile;
import mx.edu.sep.dgtic.mejoredu.rest.client.model.ResponseGetFile;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.rest.client.AlfrescoRestClient;
import mx.sep.dgtic.mejoredu.seguimiento.rest.client.MultipartBody;
import mx.sep.dgtic.mejoredu.seguimiento.ActualizarProyectoAnual;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Actividad;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Proyecto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.*;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.PeticionCancelacionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.RespuestaAdecuacionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.RespuestaRegistroProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.service.ProyectoService;

import org.apache.poi.openxml4j.exceptions.NotOfficeXmlFileException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.aspose.words.Document;
import com.aspose.words.SaveFormat;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProyectoServiceImpl implements ProyectoService {
  private static final Integer REGISTRO_PROYECTO = 2;

  @Inject
  private ProyectoAnualRepository proyectoAnualRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private AnhoPlaneacionRespository anhoPlaneacionRespository;
  @Inject
  private ArchivoRepository archivoRepository;
  @Inject
  private MasterCatalogoRepository catalogoRepository;
  @Inject
  private ContribucionCatalogoRepository contribucionRepository;
  @Inject
  private SecuenciaNegocioRepository secuenciadorRepository;
  @Inject
  private TipoDocumentoRepository tipoDocumentoRepository;
  @Inject
  private ActividadRepository actividadRepository;
  @Inject
  private ProductoRepository productoRepository;
  @Inject
  private MetValidacionRepository validacionRepository;
  @Inject
  private AdecuacionProyectoRepository adecuacionProyectoRepository;
  @Inject
  private AdecuacionActividadRepository adecuacionActividadRepository;
  @Inject
  private AdecuacionProductoRepository adecuacionProductoRepository;
  @Inject
  private AdecuacionAccionRepository adecuacionAccionRepository;
  @Inject
  private AvanceRepository avanceRepository;
  @RestClient
  private AlfrescoRestClient alfrescoRest;
  @ConfigProperty(name = "sipse.alf.uuid")
  private String UUID;


  @Override
  public RespuestaAdecuacionProyectoVO consultaProyectoModificacion(int idAdecuacionSolicitud, int idProyectoReferencia) {
    var adecuacionProyecto = adecuacionProyectoRepository.find("""
        SELECT a FROM AdecuacionProyecto a
        JOIN FETCH a.proyectoModificacion
        JOIN FETCH a.proyectoReferencia
        WHERE a.idAdecuacionSolicitud = ?1
        AND a.idProyectoReferencia = ?2
        AND a.idProyectoModificacion IS NOT NULL
        """, idAdecuacionSolicitud, idProyectoReferencia).firstResultOptional().orElseThrow(() -> new NotFoundException("No se encontró el proyecto con idAdecuacionSolicitud " + idAdecuacionSolicitud + " e idProyectoReferencia " + idProyectoReferencia));

    var adecuaconProyectoVO = new RespuestaAdecuacionProyectoVO();
    adecuaconProyectoVO.setIdProyectoModificacion(adecuacionProyecto.getIdProyectoModificacion());
    adecuaconProyectoVO.setProyectoModificacion(entitieToVO(adecuacionProyecto.getProyectoModificacion()));
    adecuaconProyectoVO.setIdProyectoReferencia(adecuacionProyecto.getIdProyectoReferencia());
    adecuaconProyectoVO.setProyectoReferencia(entitieToVO(adecuacionProyecto.getProyectoReferencia()));

    return adecuaconProyectoVO;
  }

  @Override
  public List<RespuestaAdecuacionProyectoVO> consultaProyectoModificacion(int idAdecuacionSolicitud) {
    var adecuacionProyecto = adecuacionProyectoRepository.list("""
        SELECT a FROM AdecuacionProyecto a
        JOIN FETCH a.proyectoModificacion
        JOIN FETCH a.proyectoReferencia
        WHERE a.idAdecuacionSolicitud = ?1
        AND a.idProyectoReferencia IS NOT NULL
        AND a.idProyectoModificacion IS NOT NULL
        """, idAdecuacionSolicitud);


    return adecuacionProyecto.stream().map(it -> {

      var adecuaconProyectoVO = new RespuestaAdecuacionProyectoVO();
      adecuaconProyectoVO.setIdProyectoModificacion(it.getIdProyectoModificacion());
      adecuaconProyectoVO.setProyectoModificacion(entitieToVO(it.getProyectoModificacion()));

      if (it.getProyectoReferencia() != null) {
        adecuaconProyectoVO.setIdProyectoReferencia(it.getIdProyectoReferencia());
        adecuaconProyectoVO.setProyectoReferencia(entitieToVO(it.getProyectoReferencia()));
      }

      return adecuaconProyectoVO;
    }).toList();
  }

  @Override
  public RespuestaAdecuacionProyectoVO consultarSolicitudAdecuacion(int idAdecuacionSolicitud) {
    var adecuacionProyecto = adecuacionProyectoRepository.find("""
            SELECT a FROM AdecuacionProyecto a
            WHERE a.idAdecuacionSolicitud = ?1
            AND a.idProyectoModificacion IS NOT NULL
            """, idAdecuacionSolicitud)
        .firstResultOptional()
        .orElseThrow(() ->
            new NotFoundException("No se encontró el proyecto con idAdecuacionSolicitud " + idAdecuacionSolicitud)
        );

    var adecuaconProyectoVO = new RespuestaAdecuacionProyectoVO();
    adecuaconProyectoVO.setIdProyectoModificacion(adecuacionProyecto.getIdProyectoModificacion());
    adecuaconProyectoVO.setProyectoModificacion(entitieToVO(adecuacionProyecto.getProyectoModificacion()));
    adecuaconProyectoVO.setIdProyectoReferencia(adecuacionProyecto.getIdProyectoReferencia());
    //adecuaconProyectoVO.setProyectoReferencia(entitieToVO(adecuacionProyecto.getProyectoReferencia()));

    return adecuaconProyectoVO;
  }
  @Override
  public List<RespuestaAdecuacionProyectoVO> consultarSolicitudAdecuacionList(int idAdecuacionSolicitud) {
    var adecuacionProyecto = adecuacionProyectoRepository.find("""
            SELECT a FROM AdecuacionProyecto a
            WHERE a.idAdecuacionSolicitud = ?1
            AND a.idProyectoModificacion IS NOT NULL
            """, idAdecuacionSolicitud).list();

    List<RespuestaAdecuacionProyectoVO> adecuaconProyectoVOList = new ArrayList<>();
    for (int i = 0; i < adecuacionProyecto.size(); i++) {

      var adecuacionProyectoVO  = new RespuestaAdecuacionProyectoVO();
      adecuacionProyectoVO.setIdProyectoModificacion(adecuacionProyecto.get(i).getIdProyectoModificacion());
      adecuacionProyectoVO.setProyectoModificacion(entitieToVO(adecuacionProyecto.get(i).getProyectoModificacion()));
      adecuacionProyectoVO.setIdProyectoReferencia(adecuacionProyecto.get(i).getIdProyectoReferencia());
      if (adecuacionProyecto.get(i).getProyectoReferencia() != null)
      adecuacionProyectoVO.setProyectoReferencia(entitieToVO(adecuacionProyecto.get(i).getProyectoReferencia()));
      adecuaconProyectoVOList.add(adecuacionProyectoVO);
    }

    return adecuaconProyectoVOList;
  }

  @Override
  public List<RespuestaAdecuacionProyectoVO> consultaProyectoCancelacion(int idAdecuacionSolicitud) {
    var adecuacionProyecto = adecuacionProyectoRepository.list("""
        SELECT a FROM AdecuacionProyecto a
        JOIN FETCH a.proyectoReferencia
        WHERE a.idAdecuacionSolicitud = ?1
        AND a.idProyectoReferencia IS NOT NULL
        AND a.idProyectoModificacion IS NULL
        """, idAdecuacionSolicitud);


    return adecuacionProyecto.stream().map(it -> {
      var adecuaconProyectoVO = new RespuestaAdecuacionProyectoVO();
      adecuaconProyectoVO.setIdProyectoModificacion(it.getIdProyectoModificacion());
      adecuaconProyectoVO.setIdProyectoReferencia(it.getIdProyectoReferencia());
      adecuaconProyectoVO.setProyectoReferencia(entitieToVO(it.getProyectoReferencia()));

      return adecuaconProyectoVO;
    }).toList();
  }

  @Override
  public List<ProyectoVO> consultaProyectos(int idAnhio, List<String> estatus, boolean excluirCortoPlazo, Integer idSolicitud, boolean priorizarProyectoAsociado) {
    /*
     * El proyecto esta asociado a n número de actividades
     * Las actividades están asociadas a n número de productos
     * Los productos están asociados a n número de acciones
     *
     * Las adecuaciones de tipo alta son aqullas que tienen una entidad de modificación pero no tienen una entidad de referencia
     *
     * En caso de que la solicitud tenga adecuaciones de actividades de tipo Alta, se debe tomar el proyecto de la actividad de modificación
     *    De lo contrario, se sigue con lo siguiente
     * En caso de que la solicitud tenga adecuaciones de productos de tipo Alta, se debe tomar el proyecto de la actividad del producto modificación
     *   De lo contrario, se sigue con lo siguiente
     * En caso de que la solicitud tenga adecuaciones de acciones de tipo Alta, se debe tomar el proyecto de la actividad del producto de la acción de modificación
     *  De lo contrario, se sigue con lo siguiente
     * Se toman los proyectos de la consulta findByAnhioAndEstatus
     */
    if (priorizarProyectoAsociado) {
      var adecuacionesAltasProyecto = adecuacionProyectoRepository.findAltaByIdSolicitud(idSolicitud);
      if (!adecuacionesAltasProyecto.isEmpty()) {
        return List.of(entitieToVO(adecuacionesAltasProyecto.get(0).getProyectoModificacion()));
      }
      var adecuacionesAltasActividad = adecuacionActividadRepository.findAltaByIdSolicitud(idSolicitud);
      if (!adecuacionesAltasActividad.isEmpty()) {
        var proyecto = adecuacionesAltasActividad.get(0).getActividadModificacion().getProyectoAnual();
        return List.of(entitieToVO(proyecto));
      }
      var adecuacionesAltasProducto = adecuacionProductoRepository.findAltaByIdSolicitud(idSolicitud);
      if (!adecuacionesAltasProducto.isEmpty()) {
        var proyecto = adecuacionesAltasProducto.get(0).getProductoModificacion().getActividad().getProyectoAnual();
        return List.of(entitieToVO(proyecto));
      }
      var adecuacionesAltasAccion = adecuacionAccionRepository.findAltaByIdSolicitud(idSolicitud);
      if (!adecuacionesAltasAccion.isEmpty()) {
        var proyecto = adecuacionesAltasAccion.get(0).getAccionModificacion().getProducto().getActividad().getProyectoAnual();
        return List.of(entitieToVO(proyecto));
      }
    }

    var proyectos = proyectoAnualRepository.findByAnhioAndEstatus(idAnhio, estatus, excluirCortoPlazo, idSolicitud);

    return proyectos.stream().map(this::entitieToVO).toList();
  }

  @Override
  public List<ProyectoVO> consultaProyectos(int idAnhio, int itSemantica) {
    var estatus = List.of("C", "I");
    List<Proyecto> proyectos;

    if (itSemantica == 1) {
      proyectos = proyectoAnualRepository.findByAnhioAndCsEstatusOnlyWithoutAdecuaciones(idAnhio, estatus);
    } else if (itSemantica == 2) {
      proyectos = proyectoAnualRepository.findByAnhioAndCsEstatusOnlyAdecuaciones(idAnhio, estatus);
    } else {
      proyectos = proyectoAnualRepository.findByAnhioAndCsEstatus(idAnhio, estatus);
    }

    if (proyectos.isEmpty()) throw new NotFoundException("No se encontraron proyectos para el año " + idAnhio);

    return proyectos.stream().map(this::entitieToVO).toList();
  }

  @Override
  public ProyectoVO consultaProyectoPorId(int idProyecto) {
    var proyecto = proyectoAnualRepository.findByIdOptional(idProyecto).orElseThrow(() -> new NotFoundException("No se encontró el proyecto con id " + idProyecto));
    return entitieToVO(proyecto);
  }

  @Override
  public RespuestaProyectos consultaProyectosParaValidar(int idAnhio, int itSemantica) {
    RespuestaProyectos respuesta = new RespuestaProyectos();
    PanacheQuery<Proyecto> proyectoPenache;
    proyectoPenache = proyectoAnualRepository.find("anhoPlaneacion.idAnhio = ?1 AND itSemantica = ?2 AND csEstatus != 'B'", idAnhio, itSemantica);
    Mensaje mensaje = new Mensaje("200", "Exitoso");
    if (proyectoPenache.count() > 0) {

      List<mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto> proyectos = new ArrayList<mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto>();
      for (Proyecto proyecto : proyectoPenache.list()) {

        respuesta.setMensaje(mensaje);
        mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto proyDto = new mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto();
        proyDto.setIdProyecto(proyecto.getIdProyecto());
        proyDto.setNombreUnidad(proyecto.getCxNombreUnidad());
        proyDto.setClaveUnidad(proyecto.getCveUnidad());

        proyDto.setEstatus(proyecto.getCsEstatus());
        // Validar estauts de planeación
        String estatusPlaneacion = "P"; // pendiente por validar
        if (proyecto.getIdValidacionPlaneacion() != null) {
          MetValidacionEntity validacionPlan = validacionRepository.findById(proyecto.getIdValidacionPlaneacion());
          estatusPlaneacion = validacionPlan.getCsEstatus();
        }
        proyDto.setEstatusPlaneacion(estatusPlaneacion);
        // Validar estauts de Supervisor
        String estatusSupervisor = "P";
        if (proyecto.getIdValidacionSupervisor() != null) {
          MetValidacionEntity validacionPlanSuper = validacionRepository.findById(proyecto.getIdValidacionSupervisor());
          estatusSupervisor = validacionPlanSuper.getCsEstatus();
        }
        proyDto.setEstatusSupervisor(estatusSupervisor);

        proyDto.setAlcance(proyecto.getCxAlcance());
        proyDto.setClave(proyecto.getCveProyecto() + "");
        proyDto.setNombre(proyecto.getCxNombreProyecto());
        proyDto.setCveUsuario(proyecto.getUsuario().getCveUsuario());
        proyDto.setFundamentacion(proyecto.getCxFundamentacion());
        proyDto.setObjetivo(proyecto.getCxObjetivo());
        proyDto.setDhActualizacion(proyecto.getDhActualizacion());
        proyDto.setDfActualizacion(proyecto.getDfactualizacion());
        proyDto.setCveUsuarioActualiza(proyecto.getCveUsuarioActualiza());
        Log.debug(proyecto.getArchivo().getUuid());

        ProyectoContribucion contribucionEspecial = contribucionRepository.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 2).firstResult();
        List<ProyectoContribucion> contribucionesObjetivo = contribucionRepository.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 1).list();
        List<ProyectoContribucion> contribucionesPNC = contribucionRepository.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 3).list();
        List<ContribucionCatalogo> contribucionesObj = new ArrayList<ContribucionCatalogo>();
        for (ProyectoContribucion contribucionObjetivo : contribucionesObjetivo) {
          ContribucionCatalogo contribucion = new ContribucionCatalogo();

          contribucion.setIdCatalogo(contribucionObjetivo.getContribucion().getId());
          contribucion.setIdSecContribucion(contribucionObjetivo.getIdProycontri());
          contribucion.setIdProyecto(proyecto.getIdProyecto());
          contribucion.setTipoContribucion(1);
          contribucionesObj.add(contribucion);
        }
        proyDto.setContribucionObjetivoPrioritarioPI(contribucionesObj);
        List<ContribucionCatalogo> contribucionesPNCDto = new ArrayList<ContribucionCatalogo>();
        if (null != contribucionEspecial)
          proyDto.setContribucionProgramaEspecial(contribucionEspecial.getContribucion().getId());
        for (ProyectoContribucion contribucionPNC : contribucionesPNC) {
          ContribucionCatalogo contribucion = new ContribucionCatalogo();
          contribucion.setIdCatalogo(contribucionPNC.getContribucion().getId());
          contribucion.setIdSecContribucion(contribucionPNC.getIdProycontri());
          contribucion.setIdProyecto(proyecto.getIdProyecto());
          contribucion.setTipoContribucion(3);

          contribucionesPNCDto.add(contribucion);
        }
        proyDto.setContribucionPNCCIMGP(contribucionesPNCDto);

        List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = generarArrayArchivos(proyecto);
        proyDto.setArchivos(archivosDto);
        proyDto.setIxAccion(proyecto.getIxAccion());
        proyectos.add(proyDto);
      }

      respuesta.setProyecto(proyectos);
    } else {
      Mensaje mensajeError = new Mensaje("400", "No encontró registros.");
      respuesta.setMensaje(mensajeError);
    }

    return respuesta;
  }

  @Override
  public RespuestaProyectos consultaProyectosCarga(int idAnhio, int idProyecto) {
    RespuestaProyectos respuesta = new RespuestaProyectos();
    PanacheQuery<Proyecto> proyectoPenache;

    if (idAnhio > 0) {
      proyectoPenache = proyectoAnualRepository.find("anhoPlaneacion.idAnhio = ?1 and ix_fuente_registro =1 and csEstatus in ('C','I')", idAnhio);
    } else {
      proyectoPenache = proyectoAnualRepository.find("idProyecto = ?1 and ix_fuente_registro =1 and csEstatus in ('C','I')", idProyecto);
    }

    Mensaje mensaje = new Mensaje("200", "Exitoso");
    if (proyectoPenache.count() > 0) {

      List<mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto> proyectos = new ArrayList<mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto>();
      for (Proyecto proyecto : proyectoPenache.list()) {

        respuesta.setMensaje(mensaje);
        mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto proyDto = new mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto();
        proyDto.setIdProyecto(proyecto.getIdProyecto());
        proyDto.setNombreUnidad(proyecto.getCxNombreUnidad());
        proyDto.setClaveUnidad(proyecto.getCveUnidad());
        proyDto.setEstatus(proyecto.getCsEstatus());
        proyDto.setAlcance(proyecto.getCxAlcance());
        proyDto.setClave(proyecto.getCveProyecto() + "");
        proyDto.setNombre(proyecto.getCxNombreProyecto());
        proyDto.setCveUsuario(proyecto.getUsuario().getCveUsuario());
        proyDto.setFundamentacion(proyecto.getCxFundamentacion());
        proyDto.setObjetivo(proyecto.getCxObjetivo());
        Log.debug(proyecto.getArchivo().getUuid());

        ProyectoContribucion contribucionEspecial = contribucionRepository.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 2).firstResult();
        List<ProyectoContribucion> contribucionesObjetivo = contribucionRepository.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 1).list();
        List<ProyectoContribucion> contribucionesPNC = contribucionRepository.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 3).list();
        List<ContribucionCatalogo> contribucionesObj = new ArrayList<ContribucionCatalogo>();
        for (ProyectoContribucion contribucionObjetivo : contribucionesObjetivo) {
          ContribucionCatalogo contribucion = new ContribucionCatalogo();

          contribucion.setIdCatalogo(contribucionObjetivo.getContribucion().getId());
          contribucion.setIdSecContribucion(contribucionObjetivo.getIdProycontri());
          contribucion.setIdProyecto(proyecto.getIdProyecto());
          contribucion.setTipoContribucion(1);
          contribucionesObj.add(contribucion);
        }
        proyDto.setContribucionObjetivoPrioritarioPI(contribucionesObj);
        List<ContribucionCatalogo> contribucionesPNCDto = new ArrayList<ContribucionCatalogo>();
        if (null != contribucionEspecial)
          proyDto.setContribucionProgramaEspecial(contribucionEspecial.getContribucion().getId());
        for (ProyectoContribucion contribucionPNC : contribucionesPNC) {
          ContribucionCatalogo contribucion = new ContribucionCatalogo();
          contribucion.setIdCatalogo(contribucionPNC.getContribucion().getId());
          contribucion.setIdSecContribucion(contribucionPNC.getIdProycontri());
          contribucion.setIdProyecto(proyecto.getIdProyecto());
          contribucion.setTipoContribucion(3);

          contribucionesPNCDto.add(contribucion);
        }
        proyDto.setContribucionPNCCIMGP(contribucionesPNCDto);

        List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = generarArrayArchivos(proyecto);
        proyDto.setArchivos(archivosDto);
        proyectos.add(proyDto);
      }

      respuesta.setProyecto(proyectos);
    } else {
      Mensaje mensajeError = new Mensaje("400", "No encontró registros.");
      respuesta.setMensaje(mensajeError);
    }

    return respuesta;
  }

  private List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> generarArrayArchivos(Proyecto proyecto) {
    List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = new ArrayList<>();
    mx.edu.sep.dgtic.mejoredu.comun.Archivo archivoDto = new mx.edu.sep.dgtic.mejoredu.comun.Archivo();
    archivoDto.setEstatus(proyecto.getArchivo().getEstatus());
    archivoDto.setNombre(proyecto.getArchivo().getNombre());
    archivoDto.setUsuario(proyecto.getUsuario().getCveUsuario());
    archivoDto.setUuid(proyecto.getArchivo().getUuid());
    archivoDto.setUuidToPdf(proyecto.getArchivo().getUuidToPdf());
    archivoDto.setIdArchivo(proyecto.getArchivo().getIdArchivo());
    archivosDto.add(archivoDto);
    return archivosDto;
  }

  @Override
  @Transactional
  public RespuestaRegistroProyectoVO registrarProyectoAnual(PeticionProyectoVO peticionProyecto) {
    // Además del flujo tradicional, se debe de guardar la adecuación proyecto apuntando
    // al proyecto que se está registrando como proyecto de modificación
    var adecuacionProyecto = peticionProyecto.getIdProyectoReferencia() == null
        ? new AdecuacionProyecto()
        : adecuacionProyectoRepository.find("""
                SELECT ap FROM AdecuacionProyecto ap
                JOIN FETCH ap.proyectoModificacion
                WHERE ap.idAdecuacionSolicitud = ?1
                AND ap.idProyectoModificacion IS NOT NULL
                AND ap.idProyectoReferencia = ?2
                """,
            peticionProyecto.getIdAdecuacionSolicitud(),
            peticionProyecto.getIdProyectoReferencia())
        .firstResultOptional()
        .orElseGet(AdecuacionProyecto::new);

    var proyecto = adecuacionProyecto.getProyectoModificacion() == null
        ? new Proyecto()
        : adecuacionProyecto.getProyectoModificacion();

    proyecto.setCsEstatus(peticionProyecto.getCsEstatus());
    proyecto.setCxObjetivo(peticionProyecto.getObjetivo());
    proyecto.setCxObjetivoPrioritario(peticionProyecto.getObjetivoPriori());
    proyecto.setCveProyecto(peticionProyecto.getCveProyecto());
    proyecto.setCxNombreProyecto(peticionProyecto.getNombreProyecto());
    proyecto.setCxAlcance(peticionProyecto.getAlcance());
    proyecto.setCxFundamentacion(peticionProyecto.getFundamentacion());
    proyecto.setCxNombreUnidad(peticionProyecto.getNombreUnidad());
    proyecto.setCveUnidad(peticionProyecto.getClaveUnidad());

    if (peticionProyecto.getClaveUnidad() != null) {
      MasterCatalogo catalogoUnidad = catalogoRepository.find("ccExterna=?1 and catalogoPadre.id=2059", peticionProyecto.getClaveUnidad()).firstResult();
      proyecto.setUnidadAdministrativa(catalogoUnidad);
    } else {
      throw new NotFoundException("No se encontró la unidad administrativa con clave " + peticionProyecto.getClaveUnidad());
    }

    AnhoPlaneacion anhio = anhoPlaneacionRespository.findById(peticionProyecto.getIdAnhio());
    Usuario usuario = usuarioRepository.findById(peticionProyecto.getCveUsuario());

    proyecto.setAnhoPlaneacion(anhio);
    proyecto.setUsuario(usuario);

    Archivo archivoAlf = new Archivo();
    Log.debug(peticionProyecto.getArchivos().get(0).getEstatus());

    archivoAlf.setEstatus(peticionProyecto.getArchivos().get(0).getEstatus());
    archivoAlf.setNombre(peticionProyecto.getArchivos().get(0).getNombre());
    archivoAlf.setUsuario(usuarioRepository.findById(peticionProyecto.getArchivos().get(0).getUsuario()));
    archivoAlf.setUuid(peticionProyecto.getArchivos().get(0).getUuid());
    archivoAlf.setFechaCarga(LocalDate.now());
    archivoAlf.setHoraCarga(LocalTime.now());

    String uuidPDF = null;
    try {
      uuidPDF = this.getUiidPdfAlfresco(peticionProyecto.getArchivos().get(0).getUuid());
      // uuidPDF = "SDDF-SDFGSDSDF-SDFGSDFGS-SDFG";

      archivoAlf.setUuidToPdf(uuidPDF);
    } catch (NotOfficeXmlFileException e) {
      RespuestaRegistroProyectoVO respuestaRegistroProyectoVO = new RespuestaRegistroProyectoVO();
      respuestaRegistroProyectoVO.setIdProyecto(-1);
      return respuestaRegistroProyectoVO;
    }


    TipoDocumento tipoDoc = new TipoDocumento();
    tipoDoc.setIdTipoDocumento(1);
    archivoAlf.setTipoDocumento(tipoDoc);

    archivoRepository.persistAndFlush(archivoAlf);
    Archivo archivoInto = archivoRepository.find("uuid", peticionProyecto.getArchivos().get(0).getUuid()).firstResultOptional().orElseThrow(() -> new NotFoundException("No se encontró el archivo con uuid " + peticionProyecto.getArchivos().get(0).getUuid()));

    proyecto.setArchivo(archivoInto);
    proyecto.setItSemantica(REGISTRO_PROYECTO);
    proyecto.setIxAccion(peticionProyecto.getIdAccion());
    // Guardar proyecto
    proyectoAnualRepository.persistAndFlush(proyecto);

    // Guardar adecuación proyecto
    adecuacionProyecto.setIdProyectoModificacion(proyecto.getIdProyecto());
    adecuacionProyecto.setIdAdecuacionSolicitud(peticionProyecto.getIdAdecuacionSolicitud());
    adecuacionProyecto.setIdProyectoReferencia(peticionProyecto.getIdProyectoReferencia());

    adecuacionProyectoRepository.persist(adecuacionProyecto);

    guardarContribuciones(proyecto, peticionProyecto);
    var respuesta = new RespuestaRegistroProyectoVO();
    respuesta.setIdProyecto(proyecto.getIdProyecto());
    return respuesta;
  }

  @Override
  public String getUiidPdfAlfresco(String uuid) {
    ResponseGetFile resGetFile = getFileAlfresco(uuid);

    ByteArrayOutputStream pdfOutputStream = convertirWordToPdf(resGetFile.getInputStream());
    if (pdfOutputStream == null) {
      return null;
    }
    InputStream in = new ByteArrayInputStream(pdfOutputStream.toByteArray());

    MultipartBody multi = new MultipartBody();
    multi.name = resGetFile.getFileName();
    multi.filedata = in;
    multi.autoRename = true;

    Response responseSave = alfrescoRest.createFile(UUID, multi);
    ResponseCreateFile nodeCreate = responseSave.readEntity(ResponseCreateFile.class);
    Log.info(nodeCreate.getEntry().getId());

    String uuidPDF = nodeCreate.getEntry().getId();
    return uuidPDF;
  }

  @SneakyThrows
  private ResponseGetFile getFileAlfresco(String uuid) throws NotOfficeXmlFileException {
    Response file = alfrescoRest.getFile(uuid);
    InputStream inputStream = file.readEntity(InputStream.class);
    if (inputStream.available() == 0) {
      Log.error("The file retrieved from Alfresco is empty (zero bytes long)");
      throw new IOException("The file retrieved from Alfresco is empty (zero bytes long)");
    }
    String fileName = file.getMetadata().get("Content-Disposition").get(0).toString()
        .replaceFirst("(?i)^.*filename=\"?([^\"]+)\"?.*$", "$1");
    fileName = fileName.substring(0, fileName.lastIndexOf('.'));

    return ResponseGetFile.builder().inputStream(inputStream).fileName(fileName + ".pdf").build();
  }

  private ByteArrayOutputStream convertirWordToPdf(InputStream wordInputStream) {
    try {
      // Verificar que el InputStream no esté vacío
      if (wordInputStream.available() == 0) {
        Log.error("El Archivo Word no tiene texto, por favor valida que no esté dañado o intenta con otro.");
        return null;
      }

      // Crear el documento Aspose.Words a partir del InputStream
      Document doc = new Document(wordInputStream);

      // Crear un ByteArrayOutputStream para guardar el PDF
      ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();

      // Guardar el documento en formato PDF
      doc.save(pdfOutputStream, SaveFormat.PDF);

      return pdfOutputStream;

    } catch (Exception e) {
      Log.error("Error al convertir Word a PDF: " + e.getMessage(), e);
      return null;
    }
  }

  private void guardarContribuciones(Proyecto proyectoGenerado, PeticionProyecto peticionProyecto) {

    // Contribucón especial
    if (peticionProyecto.getContribucionProgramaEspecial() != null) {
      var contribucionEspecial = catalogoRepository.findByIdOptional(peticionProyecto.getContribucionProgramaEspecial()).orElseThrow(() -> {
        throw new NotFoundException("No se encontró la contribución programa especial con id " + peticionProyecto.getContribucionProgramaEspecial());
      });
      ProyectoContribucion contribucion = new ProyectoContribucion();
      contribucion.setProyectoAnual(proyectoGenerado);
      contribucion.setIxTipoContri(2);
      contribucion.setContribucion(contribucionEspecial);
      contribucionRepository.persistAndFlush(contribucion);
    }
    // Contribucón Objetivo
    for (ContribucionCatalogo contriObj : peticionProyecto.getContribucionObjetivo()) {
      ProyectoContribucion contriObjEnt = new ProyectoContribucion();
      contriObjEnt.setProyectoAnual(proyectoGenerado);
      contriObjEnt.setIxTipoContri(1);
      contriObjEnt.setContribucion(catalogoRepository.findById(contriObj.getIdCatalogo()));
      contribucionRepository.persistAndFlush(contriObjEnt);
    }
    // Contribucón PNC
    for (ContribucionCatalogo contriPNC : peticionProyecto.getContribucionPNCCIMGP()) {
      ProyectoContribucion contriPNCEnt = new ProyectoContribucion();
      contriPNCEnt.setProyectoAnual(proyectoGenerado);
      contriPNCEnt.setIxTipoContri(3);
      contriPNCEnt.setContribucion(catalogoRepository.findById(contriPNC.getIdCatalogo()));
      contribucionRepository.persistAndFlush(contriPNCEnt);
    }

  }

  @Override
  public MensajePersonalizado<Integer> secuencialProyectoAnual(Integer idUnidad) {

    MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
    respuesta.setCodigo("200");
    respuesta.setMensaje("Exitoso");
    // -Recuperar secuencia de la unidad
    var secuenciaPorUnidad = secuenciadorRepository.find("unidadAdmiva.id", idUnidad).firstResult();

    // Sort.by("idProyecto").descending()
    if (secuenciaPorUnidad == null) {
      secuenciaPorUnidad = new SecuenciaNegocio();
      MasterCatalogo unidadAdmiva = catalogoRepository.findById(idUnidad);
      if (unidadAdmiva == null) {
        throw new NotFoundException("No existe la unidad administrativa con id " + idUnidad);
      }
      // Asignamos unidad encontrada
      secuenciaPorUnidad.setUnidadAdmiva(unidadAdmiva);
    }

    Integer secAdmiva = 0;

    if (secuenciaPorUnidad.getIdSecuencia() == null) secAdmiva = 1;
    else {
      // secAdmiva = secuenciaPorUnidad.getIxSecuencia() + 1;
      secAdmiva = secuenciaPorUnidad.getIxSecuencia();
    }
    secuenciaPorUnidad.setIxSecuencia(secAdmiva);

    try {
      respuesta.setRespuesta(secAdmiva);
      /* secuenciadorRepository.persistAndFlush(secuenciaPorUnidad); */
    } catch (Exception e) {
      respuesta.setCodigo("500");
      respuesta.setMensaje("Error al calcular y pesistir la secuencia por unidad admiva");
      e.printStackTrace();
    }
    return respuesta;
  }

  @Override
  public MensajePersonalizado<String> covertirAPdf(String uuid) {
    MensajePersonalizado<String> respuesta = new MensajePersonalizado<String>();
    respuesta.setCodigo("200");
    respuesta.setMensaje("Archivo convertido con éxito, se deja en alfresco con UUID:");
    Archivo archivo = archivoRepository.find("", uuid).firstResult();
    archivo.setUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
    archivoRepository.persistAndFlush(archivo);
    respuesta.setRespuesta("d9468b9e-78a6-400b-a681-7e753e4d3622");
    return respuesta;

    // Al registrar convertir y asignar uuid pdf
    // "d9468b9e-78a6-400b-a681-7e753e4d3622"
  }

  @Override
  @Transactional
  @lombok.SneakyThrows
  public RespuestaGenerica cargaExcel(InputStream file, String cveUsuario) {

    Proyecto registro = new Proyecto();
    TipoDocumento tipoDocumento = tipoDocumentoRepository.findByExtension("pdf");
    Archivo archivo = new Archivo();
    Usuario usuario = usuarioRepository.findById(cveUsuario);
    try {
      @SuppressWarnings("resource") Workbook workbook = new XSSFWorkbook(file); // Cargar el archivo Excel en el objeto Workbook;
      int NumeroDeHojas = workbook.getNumberOfSheets();
      Log.info("NumeroDeHojas" + NumeroDeHojas);

      Sheet proyectos = workbook.getSheetAt(0); // Hoja asociada a proyectos

      for (Row row : proyectos) {
        if (row.getRowNum() > 0) {
          if (row.getCell(0) == null) {
            break;
          }
          if (row.getCell(2) == null) {
            throw new BadRequestException("El nombre del proyecto en la pestaña de proyectos, no puede ser nulo; favor de revisar tu archivo. ");
          }
          String campo1 = row.getCell(0).getStringCellValue();
          if (campo1 == null || ObjectUtils.isEmpty(campo1)) {
            throw new BadRequestException("La clave de proyecto en la pestaña de proyectos, no puede ser nulo; favor de revisar tu archivo. ");
          }
          String campo2 = row.getCell(1).getStringCellValue();
          if (campo2 == null || ObjectUtils.isEmpty(campo2)) {
            throw new BadRequestException("El objetivo del proyecto en la pestaña de proyectos, no puede ser nulo; favor de revisar tu archivo. ");
          }
          int campo3 = (int) row.getCell(2).getNumericCellValue();
          String campo4 = row.getCell(3).getStringCellValue();
          Log.info("campo6 " + campo4);
          String campo5 = row.getCell(4).getStringCellValue();
          Log.info("campo7 " + campo5);
          String campo6 = row.getCell(5).getStringCellValue();
          Log.info("campo8 " + campo6);

          if (row.getCell(2) != null) {
            AnhoPlaneacion anhio = anhoPlaneacionRespository.findById(campo3);
            registro.setAnhoPlaneacion(anhio);
          } else {
            AnhoPlaneacion anhio = anhoPlaneacionRespository.findById(2023);
            registro.setAnhoPlaneacion(anhio);
          }
          int cveProyecto = this.secuencialProyectoAnual(Integer.valueOf(campo6)).getRespuesta();
          List<MasterCatalogo> catalogoUnidad = catalogoRepository.find("MasterCatalogo2.idCatalogo=?1 and ccExterna=?2", 1978, campo6).list();
          List<MasterCatalogo> catalogoAlcance = catalogoRepository.find("MasterCatalogo2.idCatalogo=?1 and cdOpcion=?2", 829, campo4).list();

          registro.setCveProyecto(cveProyecto);
          registro.setCxNombreProyecto(campo1);
          registro.setCxObjetivo(campo2);
          registro.setCxNombreUnidad(catalogoUnidad.get(0).getCdOpcion());
          registro.setCxAlcance(catalogoAlcance.get(0).getCdOpcion());
          registro.setCxFundamentacion(campo5);
          registro.setCveUnidad(campo6);
          registro.setCsEstatus(EstatusEnum.INACTIVO.getEstatus());
          registro.setIx_fuente_registro(1);
          registro.setLockFlag(0);

          Archivo obtenerArchivo = archivoRepository.findByNombre("PruebasExcel");
          if (cveUsuario != null && cveUsuario != "") {
            if (usuario != null) {
              archivo.setUsuario(usuario);
              registro.setUsuario(usuario);
              registro.setArchivo(obtenerArchivo);
            } else {
              throw new WebApplicationException("No se encontro el usuario");
            }
          }
          Proyecto nombreProyecto = proyectoAnualRepository.findByNombre(campo1);
          if (nombreProyecto == null) {
            if (obtenerArchivo == null) {
              archivo.setEstatus("A");
              archivo.setNombre("PruebaExcel");
              archivo.setUuid("00000000");
              archivo.setUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
              archivo.setFechaCarga(LocalDate.now());
              archivo.setHoraCarga(LocalTime.now());
              registro.setArchivo(archivo);

              archivo.setTipoDocumento(tipoDocumento);
              archivoRepository.persist(archivo);
            }
          } else {
            throw new BadRequestException("Ya existe un Proyecto con el mismo nombre, favor de revisar tu archivo. ");
          }
          proyectoAnualRepository.getEntityManager().merge(registro);

        }
      }
      Integer idProyectoCreado = 0;
      if (NumeroDeHojas == 2 || NumeroDeHojas == 3) {
        Sheet actividades = workbook.getSheetAt(1); // Caso en que se tiene la hoja de actividades
        Log.info("entrando en actividades ");
        for (Row row : actividades) {
          if (row.getRowNum() > 0) {
            var entidad = new Actividad();
            if (row.getCell(0) == null) {
              break;
            }
            int campo1 = (int) row.getCell(0).getNumericCellValue();
            entidad.setCveActividad(campo1);
            // entidad.setDfActividad(new Date(2023,11,26));

            if (row.getCell(1) == null) {
              throw new BadRequestException("El nombre de la actividad en la pestaña de actividades, no puede ser nulo; favor de revisar tu archivo. ");
            }
            String campo2 = row.getCell(1).getStringCellValue();
            entidad.setCxNombreActividad(campo2);

            if (row.getCell(2) != null) {
              String campo3 = row.getCell(2).getStringCellValue();
              entidad.setCxDescripcion(campo3);
            }

            if (row.getCell(3) == null) {
              throw new BadRequestException("La articulación de la actividad en la pestaña de actividades, no puede ser nula; favor de revisar tu archivo. ");
            }
            String campo4 = row.getCell(3).getStringCellValue();
            entidad.setCxArticulacionActividad(campo4);
            entidad.setCsEstatus("I");

            if (row.getCell(4) != null) {
              int campo5 = (int) row.getCell(4).getNumericCellValue();
              entidad.setIcActividadTransversal(campo5);
            }
            if (row.getCell(5) != null) {
              int campo6 = (int) row.getCell(5).getNumericCellValue();
              entidad.setIxRequireReunion(campo6);
            }
            if (row.getCell(6) != null) {
              String campo7 = row.getCell(6).getStringCellValue();
              entidad.setCxTema(campo7);
            }
            if (row.getCell(7) != null) {
              int campo8 = (int) row.getCell(7).getNumericCellValue();
              var alcance = catalogoRepository.findById(campo8);
              if (alcance == null) {
                throw new NotFoundException("No existe el alcance con id " + campo8);
              }
              entidad.setCatalogoAlcance(alcance);
            }
            if (row.getCell(8) != null) {
              String campo9 = row.getCell(8).getStringCellValue();
              entidad.setCxLugar(campo9);
            }
            if (row.getCell(9) != null) {
              String campo10 = row.getCell(9).getStringCellValue();
              entidad.setCxActores(campo10);
            }

            var usuarios = usuarioRepository.findById(cveUsuario);
            if (usuarios == null) {
              throw new NotFoundException("No existe el usuario con id " + cveUsuario);
            }
            entidad.setUsuario(usuario);

            List<Proyecto> maxi = proyectoAnualRepository.listAll();
            Log.info("maxi.size() " + maxi.size());
            Log.info("maxi.get(maxi.size()-1).getIdProyecto() " + maxi.get(maxi.size() - 1).getIdProyecto());
            var proyecto = proyectoAnualRepository.findById(maxi.get(maxi.size() - 1).getIdProyecto());
            if (proyecto == null) {
              throw new NotFoundException("No existe el proyecto para este  id ");
            }
            entidad.setProyectoAnual(proyecto);
            idProyectoCreado = proyecto.getIdProyecto();
            actividadRepository.persistAndFlush(entidad);
          }
        }
      }

      if (NumeroDeHojas == 3) {
        Sheet productos = workbook.getSheetAt(2); // Caso en que se tiene la hoja de productos
        Log.info("entrando a productos ");
        Integer contadorProducto = 0;
        Integer idActividad = 0;
        Integer idActividadAnterior = 0;
        for (Row row : productos) {
          if (row.getRowNum() > 0) {
            var producto = new Producto();
            if (row.getCell(0) == null) {
              break;
            }

            String campo1 = row.getCell(0).getStringCellValue();
            producto.setCxNombre(campo1);
            if (row.getCell(1) == null) {
              throw new BadRequestException("La descripción  en la pestaña de productos, no puede ser nula; favor de revisar su archivo. ");
            }
            String campo2 = row.getCell(1).getStringCellValue();
            producto.setCxDescripcion(campo2);
            if (row.getCell(2) == null) {
              throw new BadRequestException("La vinculacion  en la pestaña de productos, no puede ser nula; favor de revisar su archivo. ");
            }
            String campo3 = row.getCell(2).getStringCellValue();
            producto.setCxVinculacionProducto(campo3);
            if (row.getCell(3) != null) {
              String campo4 = row.getCell(3).getStringCellValue();
              producto.setCbPorPublicar(campo4);
            }
            if (row.getCell(4) == null) {
              throw new BadRequestException("La clave de actividad  en la pestaña de productos, es obligatoria; favor de revisar su archivo. ");
            }
            int campo5 = (int) row.getCell(4).getNumericCellValue();
            idActividadAnterior = idActividad;
            var actividadPorClaveActividad = actividadRepository.find("cveActividad = ?1 and proyectoAnual.idProyecto = ?2", campo5, idProyectoCreado);
            if (ObjectUtils.isEmpty(actividadPorClaveActividad)) {
              throw new BadRequestException("No existe actividad  que corresponda a la clave de actividad " + campo5 + "; favor de revisar su archivo. ");
            }
            Log.info("actividadPorClaveActividad.list().get(0).getIdActividad() " + actividadPorClaveActividad.list().get(0).getIdActividad());
            var actividad = actividadRepository.findById(actividadPorClaveActividad.list().get(0).getIdActividad());
            idActividad = actividad.getIdActividad();
            if (idActividadAnterior == idActividad) {
              contadorProducto++;
            } else {
              contadorProducto = 1;
            }
            producto.setCveProducto(contadorProducto + "");
            producto.setActividad(actividad);
            producto.setCsEstatus("I");
            if (row.getCell(5) == null) {
              throw new BadRequestException("El id_catalogo_tipo_producto en la pestaña de productos, es obligatorio;\n  favor de revisar su archivo. ");
            }
            int campo6 = (int) row.getCell(5).getNumericCellValue();
            var tipoProducto = catalogoRepository.findById(campo6);
            if (tipoProducto == null) {
              throw new NotFoundException("No existe el tipoProducto con id " + campo6);
            }
            producto.setTipoProducto(tipoProducto);

            if (row.getCell(6) != null) {
              int campo7 = (int) row.getCell(6).getNumericCellValue();
              var indicadorMIR = catalogoRepository.findById(campo7);
              if (indicadorMIR == null) {
                throw new NotFoundException("No existe el indicadorMIR con id " + campo7);
              }

              producto.setIndicadorMIR(indicadorMIR);

            }

            if (row.getCell(7) == null) {
              throw new BadRequestException("El id_catalogo_nivel_educativo en la pestaña de productos, es obligatorio;\n  favor de revisar su archivo. ");
            }
            int campo8 = (int) row.getCell(7).getNumericCellValue();
            var nivelEducativo = catalogoRepository.findById(campo8);
            if (nivelEducativo == null) {
              throw new NotFoundException("No existe el nivelEducativo con id " + campo8);
            }
            producto.setNivelEducativo(nivelEducativo);

            if (row.getCell(8) != null) {
              String campo9 = row.getCell(8).getStringCellValue();
              producto.setCxCvenombrePotic(campo9);

            }
            if (row.getCell(9) != null) {
              int campo10 = (int) row.getCell(9).getNumericCellValue();
              var categorizacion = catalogoRepository.findById(campo10);
              if (categorizacion == null) {
                throw new NotFoundException("No existe la categorizacion con id " + campo10);
              }

              producto.setCategorizacion(categorizacion);

            }
            if (row.getCell(10) != null) {
              int campo11 = (int) row.getCell(10).getNumericCellValue();
              var continuidad = catalogoRepository.findById(campo11);
              if (continuidad == null) {
                throw new NotFoundException("No existe la continuidad con id " + campo11);
              }
              producto.setContinuidad(continuidad);
            }

            if (row.getCell(11) != null) {
              int campo12 = (int) row.getCell(11).getNumericCellValue();
              var indicadorPI = catalogoRepository.findById(campo12);
              if (indicadorPI == null) {
                throw new NotFoundException("No existe el indicadorPI con id " + campo12);
              }
              producto.setIndicadorPI(indicadorPI);
            }
            if (row.getCell(12) != null) {
              int campo13 = (int) row.getCell(12).getNumericCellValue();
              var anioPublicacion = catalogoRepository.findById(campo13);
              if (anioPublicacion == null) {
                throw new NotFoundException("No existe el anioPublicacion con id " + campo13);
              }
              producto.setAnhioPublicacion(anioPublicacion.getId());
            }

            usuario = usuarioRepository.findByIdOptional(cveUsuario).orElseThrow(() -> new BadRequestException("No se encontró el usuario con id " + cveUsuario));

            producto.setUsuario(usuario);
            Log.info("CveUsuario()  " + producto.getUsuario().getCveUsuario());
            Log.info("IdActividad() " + producto.getActividad().getIdActividad());

            productoRepository.persistAndFlush(producto);

          }
        }
      }
    } catch (IOException e) {
      throw new WebApplicationException("Error procesando el archivo Excel", e);
    }
    return new RespuestaGenerica("200", "Exitoso");
  }

  @Override
  @Transactional
  public void eliminarProyectoAnual(PeticionPorID peticion) {
    var proyecto = proyectoAnualRepository.findById(peticion.getId());
    var usuario = usuarioRepository.findById(peticion.getUsuario());
    proyecto.setUsuario(usuario);
    Log.debug(EstatusEnum.BLOQUEADO.getEstatus());
    proyecto.setCsEstatus("B");
    proyectoAnualRepository.persistAndFlush(proyecto);
  }

  @Override
  @Transactional
  public void eliminarAdecuacionProyectoAnual(PeticionEliminarModificacion peticion) {
    var adecuacionProyecto = adecuacionProyectoRepository.find(
            "idAdecuacionSolicitud = ?1 and idProyectoReferencia = ?2",
            peticion.getIdAdecuacionSolicitud(), peticion.getIdReferencia()
        ).firstResultOptional()
        .orElseThrow(() -> new NotFoundException("No se encontró la adecuación con id " + peticion.getIdAdecuacionSolicitud() + " y referencia " + peticion.getIdReferencia()));

    if (adecuacionProyecto.getIdProyectoModificacion() != null) {
      var proyecto = proyectoAnualRepository.findById(adecuacionProyecto.getIdProyectoModificacion());
      proyecto.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
      proyectoAnualRepository.persistAndFlush(proyecto);
    }

    adecuacionProyectoRepository.delete(adecuacionProyecto);
  }

  @Override
  @Transactional
  public RespuestaGenerica finalizarRegistro(PeticionPorID peticion) {
    var proyecto = proyectoAnualRepository.findById(peticion.getId());
    if (proyecto == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el proyecto " + peticion.getId());
    }
    var usuario = usuarioRepository.findById(peticion.getUsuario());
    if (usuario == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el usuario " + peticion.getUsuario());
    }
    proyecto.setUsuario(usuario);
    Log.debug(EstatusEnum.FINALIZADO.getEstatus());
    proyecto.setCsEstatus(EstatusEnum.FINALIZADO.getEstatus());
    proyectoAnualRepository.persistAndFlush(proyecto);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @Override
  @Transactional
  public RespuestaGenerica enviarRevision(PeticionPorID peticion) {
    var proyecto = proyectoAnualRepository.findById(peticion.getId());
    if (proyecto == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el proyecto " + peticion.getId());
    }
    var usuario = usuarioRepository.findById(peticion.getUsuario());
    if (usuario == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el usuario " + peticion.getUsuario());
    }
    proyecto.setUsuario(usuario);
    Log.debug(EstatusEnum.PORREVISAR.getEstatus());
    proyecto.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());
    proyectoAnualRepository.persistAndFlush(proyecto);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @Override
  @Transactional
  public RespuestaGenerica enviarValidacionTecnica(PeticionPorID peticion) {
    var proyecto = proyectoAnualRepository.findById(peticion.getId());
    if (proyecto == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el proyecto " + peticion.getId());
    }
    var usuario = usuarioRepository.findById(peticion.getUsuario());
    if (usuario == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el usuario " + peticion.getUsuario());
    }
    proyecto.setUsuario(usuario);
    Log.debug(EstatusEnum.VALIDACIONTECNICA.getEstatus());
    proyecto.setCsEstatus(EstatusEnum.VALIDACIONTECNICA.getEstatus());
    proyectoAnualRepository.persistAndFlush(proyecto);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @Override
  @Transactional
  public RespuestaGenerica registroAprobado(PeticionPorID peticion) {
    var proyecto = proyectoAnualRepository.findById(peticion.getId());
    if (proyecto == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el proyecto " + peticion.getId());
    }
    var usuario = usuarioRepository.findById(peticion.getUsuario());
    if (usuario == null) {
      return new RespuestaGenerica("500", "Error no se encuentra el usuario " + peticion.getUsuario());
    }
    proyecto.setUsuario(usuario);
    Log.debug(EstatusEnum.APROBADO.getEstatus());
    proyecto.setCsEstatus(EstatusEnum.APROBADO.getEstatus());
    proyectoAnualRepository.persistAndFlush(proyecto);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @Override
  @Transactional
  public RespuestaGenerica actualizarProyectoAnual(int idProyecto, ActualizarProyectoAnual peticionProyecto) {
    var proyecto = proyectoAnualRepository.findById(idProyecto);
    if (proyecto == null) {
      throw new NotFoundException("No se encontró el proyecto con id " + idProyecto);
    }

    var usuario = usuarioRepository.findById(peticionProyecto.getCveUsuario());
    if (usuario == null) {
      throw new NotFoundException("No se encontró el usuario con clave " + peticionProyecto.getCveUsuario());
    }
    var anhio = anhoPlaneacionRespository.findById(peticionProyecto.getIdAnhio());
    if (anhio == null) {
      throw new NotFoundException("No se encontró el año con id " + peticionProyecto.getIdAnhio());
    }
    if (peticionProyecto.getArchivo() != null) {
      // Pasamos a inactivo los archivos asociados al proyecto en tabla met_archivo
      Archivo archivoActual = archivoRepository.findById(proyecto.getArchivo().getIdArchivo());
      if (null != archivoActual) {
        archivoActual.setEstatus("B");
        archivoActual.setUsuario(usuario);
        archivoRepository.persistAndFlush(archivoActual);
      }

      // Registramos el nuevo archivo

      Archivo archivo = new Archivo();
      archivo.setEstatus("A");
      archivo.setNombre(peticionProyecto.getArchivo().getNombre());
      archivo.setUuid(peticionProyecto.getArchivo().getUuid());
      archivo.setUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
      archivo.setFechaCarga(LocalDate.now());
      archivo.setHoraCarga(LocalTime.now());
      archivo.setUsuario(usuario);
      TipoDocumento tipo = new TipoDocumento();
      tipo.setIdTipoDocumento(1);
      archivo.setTipoDocumento(tipo);
      archivoRepository.persistAndFlush(archivo);
      Archivo archivoGenerado = archivoRepository.find("uuid", peticionProyecto.getArchivo().getUuid()).firstResult();

      proyecto.setArchivo(archivoGenerado);

    }
    proyecto.setCveProyecto(peticionProyecto.getCveProyecto());
    proyecto.setCxNombreProyecto(peticionProyecto.getCxNombreProyecto());
    proyecto.setCxObjetivo(peticionProyecto.getCxObjetivo());
    proyecto.setCxObjetivoPrioritario(peticionProyecto.getCxObjetivoPrioritario());
    proyecto.setUsuario(usuario);
    proyecto.setAnhoPlaneacion(anhio);
    // Set dfProyecto as sql.Date now
    // proyecto.setDfProyecto(new Date(System.currentTimeMillis()));
    // proyecto.setDhProyecto(new Time(System.currentTimeMillis()));
    proyecto.setCsEstatus(peticionProyecto.getCsEstatus());

    // ********************************

    proyecto.setCxAlcance(peticionProyecto.getCxAlcance());
    proyecto.setCxFundamentacion(peticionProyecto.getCxFundamentacion());
    proyecto.setCxNombreUnidad(peticionProyecto.getCxNombreUnidad());
    proyecto.setCveUnidad(peticionProyecto.getCveUnidad());
    if (peticionProyecto.getCveUnidad() != null) {
      MasterCatalogo catalogoUnidad = catalogoRepository.find("ccExterna=?1 and catalogoPadre.id=2059", peticionProyecto.getCveUnidad()).firstResult();
      proyecto.setUnidadAdministrativa(catalogoUnidad);
    } else {
      return new RespuestaGenerica("500", "Error no existe la unidad administrativa especificada : " + peticionProyecto.getCveUnidad());
    }
    // ACtualizar contribuciones
    contribucionRepository.delete("proyectoAnual.idProyecto", proyecto.getIdProyecto());
    guardarContribuciones(proyecto, peticionProyecto);
    proyectoAnualRepository.persistAndFlush(proyecto);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @Override
  @Transactional
  public void cancelarProyecto(PeticionCancelacionProyectoVO peticion) {
    proyectoAnualRepository.findByIdOptional(peticion.getIdProyectoReferencia())
        .orElseThrow(() -> new NotFoundException("No se encontró el proyecto con id " + peticion.getIdProyectoReferencia()));

    var avance = avanceRepository.find("""
            SELECT a FROM Avance a
            JOIN a.productoCalendario pc
            JOIN pc.producto p
            JOIN p.actividad ac
            JOIN ac.proyectoAnual pa
            WHERE pa.idProyecto = ?1
            """, peticion.getIdProyectoReferencia())
        .firstResultOptional();

    if (avance.isPresent()) {
      throw new BadRequestException("No se puede cancelar el proyecto porque ya tiene avances registrados");
    }

    var adecuacionProyecto = adecuacionProyectoRepository.find("""
            idAdecuacionSolicitud = ?1
            AND idProyectoModificacion IS NULL
            AND idProyectoReferencia = ?2
            """, peticion.getIdAdecuacionSolicitud(), peticion.getIdProyectoReferencia())
        .firstResultOptional()
        .orElseGet(AdecuacionProyecto::new);

    adecuacionProyecto.setIdProyectoReferencia(peticion.getIdProyectoReferencia());
    adecuacionProyecto.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());

    adecuacionProyectoRepository.persist(adecuacionProyecto);
  }

  private void guardarContribuciones(Proyecto proyectoGenerado, ActualizarProyectoAnual peticionProyecto) {
    // Contribucón especial
    if (peticionProyecto.getContribucionProgramaEspecial() != null) {
      ProyectoContribucion contribucion = new ProyectoContribucion();
      contribucion.setProyectoAnual(proyectoGenerado);
      contribucion.setIxTipoContri(2);
      contribucion.setContribucion(catalogoRepository.findById(peticionProyecto.getContribucionProgramaEspecial()));
      contribucionRepository.persistAndFlush(contribucion);
    }

    // Contribucón Objetivo
    for (ContribucionCatalogo contriObj : peticionProyecto.getContribucionObjetivo()) {
      ProyectoContribucion contriObjEnt = new ProyectoContribucion();
      contriObjEnt.setProyectoAnual(proyectoGenerado);
      contriObjEnt.setIxTipoContri(1);
      contriObjEnt.setContribucion(catalogoRepository.findById(contriObj.getIdCatalogo()));
      contribucionRepository.persistAndFlush(contriObjEnt);
    }
    // Contribucón PNC
    for (ContribucionCatalogo contriPNC : peticionProyecto.getContribucionPNCCIMGP()) {
      ProyectoContribucion contriPNCEnt = new ProyectoContribucion();
      contriPNCEnt.setProyectoAnual(proyectoGenerado);
      contriPNCEnt.setIxTipoContri(3);
      contriPNCEnt.setContribucion(catalogoRepository.findById(contriPNC.getIdCatalogo()));
      contribucionRepository.persistAndFlush(contriPNCEnt);
    }

  }

  private ProyectoVO entitieToVO(Proyecto proyecto) {
    var proyDto = new ProyectoVO();

    proyDto.setIdProyecto(proyecto.getIdProyecto());
    proyDto.setAnhio(proyecto.getAnhoPlaneacion().getIdAnhio());
    proyDto.setNombreUnidad(proyecto.getCxNombreUnidad());
    proyDto.setClaveUnidad(proyecto.getCveUnidad());
    proyDto.setEstatus(proyecto.getCsEstatus());
    proyDto.setAlcance(proyecto.getCxAlcance());
    proyDto.setClave(proyecto.getCveProyecto() + "");
    proyDto.setNombre(proyecto.getCxNombreProyecto());
    proyDto.setCveUsuario(proyecto.getUsuario().getCveUsuario());
    proyDto.setFundamentacion(proyecto.getCxFundamentacion());
    proyDto.setObjetivo(proyecto.getCxObjetivo());
    Log.debug(proyecto.getArchivo().getUuid());

    var contribucionEspecial = proyecto.getProyectoContribucion().stream()
        .filter(contribucion -> contribucion.getIxTipoContri() == 2)
        .findFirst();
    var contribucionesObjetivo = proyecto.getProyectoContribucion().stream()
        .filter(contribucion -> contribucion.getIxTipoContri() == 1)
        .toList();
    var contribucionesPNC = proyecto.getProyectoContribucion().stream()
        .filter(contribucion -> contribucion.getIxTipoContri() == 3)
        .toList();

    var contribucionesObj = contribucionesObjetivo.stream()
        .map(contribucionObjetivo -> {
          var contribucion = new ContribucionCatalogo();
          contribucion.setIdCatalogo(contribucionObjetivo.getContribucion().getId());
          contribucion.setIdSecContribucion(contribucionObjetivo.getIdProycontri());
          contribucion.setIdProyecto(proyecto.getIdProyecto());
          contribucion.setTipoContribucion(1);
          return contribucion;
        }).toList();

    proyDto.setContribucionObjetivoPrioritarioPI(contribucionesObj);

    contribucionEspecial.ifPresent(proyectoContribucion -> proyDto.setContribucionProgramaEspecial(proyectoContribucion.getContribucion().getId()));

    var contribucionesPNCDto = contribucionesPNC.stream()
        .map(contribucionPNC -> {
          var contribucion = new ContribucionCatalogo();
          contribucion.setIdCatalogo(contribucionPNC.getContribucion().getId());
          contribucion.setIdSecContribucion(contribucionPNC.getIdProycontri());
          contribucion.setIdProyecto(proyecto.getIdProyecto());
          contribucion.setTipoContribucion(3);
          return contribucion;
        }).toList();

    proyDto.setContribucionPNCCIMGP(contribucionesPNCDto);

    List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = generarArrayArchivos(proyecto);
    proyDto.setArchivos(archivosDto);
    proyDto.setIxAccion(proyecto.getIxAccion());

    return proyDto;
  }

  @Override
  public List<Proyecto> consultaProyectoAprobado(int idAnhio, int trimestre) {
    var listCsEstatus = new ArrayList<String>();
    listCsEstatus.add("O");
    var response = proyectoAnualRepository.findByAnhioAndCsEstatus(idAnhio, listCsEstatus);
    return response;
  }

}
