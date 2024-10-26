package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import lombok.SneakyThrows;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.*;
import org.apache.poi.openxml4j.exceptions.NotOfficeXmlFileException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Calendarizacion;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ContribucionCatalogo;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PartidaPresupuestalVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionProyecto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Proyecto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectos;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectosVistaGeneral;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectosVistaGeneralPorID;
import mx.edu.sep.dgtic.mejoredu.rest.client.model.ResponseCreateFile;
import mx.edu.sep.dgtic.mejoredu.rest.client.model.ResponseGetFile;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ApartadoProyectoEstatus;
import mx.sep.dgtic.mejoredu.cortoplazo.ActividadVistaGeneralVO;
import mx.sep.dgtic.mejoredu.cortoplazo.ActualizarProyectoAnual;
import mx.sep.dgtic.mejoredu.cortoplazo.PresupuestoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.ProductoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.ProgramaInstitucionalVO;
import mx.sep.dgtic.mejoredu.cortoplazo.ProyectosVO;
import mx.sep.dgtic.mejoredu.cortoplazo.ProyectosVistaGeneralIdVO;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ActividadRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.AnhoPlaneacionRespository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ArchivoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ContribucionCatalogoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.EstrategiaActividadRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.MasterCatalogoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.MetValidacionRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.PartidaGastoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.PerfilLaboralRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.PresupuestoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ProductoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ProyectoAnualRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.SecuenciaNegocioRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.TipoDocumentoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.UsuarioRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.rest.client.AlfrescoRestClient;
import mx.sep.dgtic.mejoredu.cortoplazo.rest.client.MultipartBody;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ProyectoAnualService;

import com.aspose.words.Document;
import com.aspose.words.SaveFormat;

@Service
public class ProyectoAnualServiceImpl implements ProyectoAnualService {
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
	private PresupuestoRepository presupuestoRepository;
	@Inject
	private PartidaGastoRepository partidaGastoRepository;
	@Inject
	private PerfilLaboralRepository perfilLaboralRepository;
	@Inject
	private EstrategiaActividadRepository estrategiaActividadRepository;
	@RestClient
	private AlfrescoRestClient alfrescoRest;
	@ConfigProperty(name = "sipse.alf.uuid")
	private String UUID;

	@Inject
	mx.sep.dgtic.mejoredu.cortoplazo.dao.ProyectoCPApartadoEstatusRepository proyectoCPApartadoEstatusRepository;

	@Override
	public RespuestaProyectos consultaProyectos(int idAnhio, int idProyecto) {
		RespuestaProyectos respuesta = new RespuestaProyectos();
		List<ProyectoAnual> proyectos;

		if (idAnhio > 0) {
			proyectos = proyectoAnualRepository.findAllByYearOnlyFromCortoPlazo(idAnhio);
		} else {
			proyectos = proyectoAnualRepository.find("idProyecto", idProyecto).list();
		}

		Mensaje mensaje = new Mensaje("200", "Exitoso");
		if (!proyectos.isEmpty()) {
			var proyectosVO = new ArrayList<Proyecto>();
			for (ProyectoAnual proyecto : proyectos) {

				respuesta.setMensaje(mensaje);
				Proyecto proyDto = new Proyecto();
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
				proyDto.setDfRegistro(proyecto.getDfProyecto());
				proyDto.setDfActualizacion(proyecto.getDfactualizacion());
				proyDto.setIxCicloValidacion(proyecto.getIxCicloValidacion());
				proyDto.setDhActualizacion(proyecto.getDhActualizacion());
				proyDto.setDfActualizacion(proyecto.getDfactualizacion());
				proyDto.setDfRegistro(proyecto.getDfProyecto());
				proyDto.setDhRegistro(proyecto.getDhProyecto());
				proyDto.setCveUsuarioActualiza(proyecto.getCveUsuarioActualiza());
				proyDto.setEstatus(proyecto.getCsEstatus());

				// Recuperar el estatus de presupuesto
				String estatusPresupuesto = "P"; // pendiente por validar
				if (proyecto.getIdValidacion() != null) {
					MetValidacionEntity validacionPresu = validacionRepository.findById(proyecto.getIdValidacion());
					estatusPresupuesto = validacionPresu.getCsEstatus();
					proyDto.setIdValidacion(proyecto.getIdValidacion());
				}
				proyDto.setEstatusPresupuesto(estatusPresupuesto);

				// Validar estauts de planeación
				String estatusPlaneacion = "P"; // pendiente por validar
				if (proyecto.getIdValidacionPlaneacion() != null) {
					MetValidacionEntity validacionPlan = validacionRepository
							.findById(proyecto.getIdValidacionPlaneacion());
					estatusPlaneacion = validacionPlan.getCsEstatus();
					proyDto.setIdValidacionPlaneacion(proyecto.getIdValidacionPlaneacion());
				}
				proyDto.setEstatusPlaneacion(estatusPlaneacion);

				// Validar estauts de Supervisor
				String estatusSupervisor = "P";
				if (proyecto.getIdValidacionSupervisor() != null) {
					MetValidacionEntity validacionPlanSuper = validacionRepository
							.findById(proyecto.getIdValidacionSupervisor());
					estatusSupervisor = validacionPlanSuper.getCsEstatus();
					proyDto.setIdValidacionSupervisor(proyecto.getIdValidacionSupervisor());
				}
				proyDto.setEstatusSupervisor(estatusSupervisor);

				Log.debug(proyecto.getArchivo().getCxUuid());

				ProyectoContribucion contribucionEspecial = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 2)
						.firstResult();
				List<ProyectoContribucion> contribucionesObjetivo = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 1)
						.list();
				List<ProyectoContribucion> contribucionesPNC = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 3)
						.list();
				List<ContribucionCatalogo> contribucionesObj = new ArrayList<ContribucionCatalogo>();
				for (ProyectoContribucion contribucionObjetivo : contribucionesObjetivo) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();

					contribucion.setIdCatalogo(contribucionObjetivo.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionObjetivo.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(1);
					contribucionesObj.add(contribucion);
				}
				proyDto.setContribucionObjetivoPrioritarioPI(contribucionesObj);
				List<ContribucionCatalogo> contribucionesPNCDto = new ArrayList<ContribucionCatalogo>();
				if (null != contribucionEspecial)
					proyDto.setContribucionProgramaEspecial(contribucionEspecial.getContribucion().getIdCatalogo());
				for (ProyectoContribucion contribucionPNC : contribucionesPNC) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();
					contribucion.setIdCatalogo(contribucionPNC.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionPNC.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(3);

					contribucionesPNCDto.add(contribucion);
				}
				proyDto.setContribucionPNCCIMGP(contribucionesPNCDto);

				List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = generarArrayArchivos(proyecto);
				proyDto.setArchivos(archivosDto);
				proyectosVO.add(proyDto);
			}

			respuesta.setProyecto(proyectosVO);
		} else {
			Mensaje mensajeError = new Mensaje("400", "No encontró registros.");
			respuesta.setMensaje(mensajeError);
		}

		return respuesta;
	}

	@Override
	public RespuestaProyectos consultaProyectos(int idAnhio, EstatusEnum estatus) {
		RespuestaProyectos respuesta = new RespuestaProyectos();
		List<ProyectoAnual> proyectos;

		proyectos = proyectoAnualRepository.findAllByYearAndEstatusOnlyFromCortoPlazo(idAnhio, estatus.getEstatus());

		Mensaje mensaje = new Mensaje("200", "Exitoso");
		if (!proyectos.isEmpty()) {
			var proyectosVO = new ArrayList<Proyecto>();
			for (ProyectoAnual proyecto : proyectos) {

				respuesta.setMensaje(mensaje);
				Proyecto proyDto = new Proyecto();
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
				proyDto.setDfRegistro(proyecto.getDfProyecto());
				proyDto.setDfActualizacion(proyecto.getDfactualizacion());
				proyDto.setIxCicloValidacion(proyecto.getIxCicloValidacion());
				proyDto.setDhActualizacion(proyecto.getDhActualizacion());
				proyDto.setDfActualizacion(proyecto.getDfactualizacion());
				proyDto.setDfRegistro(proyecto.getDfProyecto());
				proyDto.setDhRegistro(proyecto.getDhProyecto());
				proyDto.setCveUsuarioActualiza(proyecto.getCveUsuarioActualiza());
				proyDto.setEstatus(proyecto.getCsEstatus());

				// Recuperar el estatus de presupuesto
				String estatusPresupuesto = "P"; // pendiente por validar
				if (proyecto.getIdValidacion() != null) {
					MetValidacionEntity validacionPresu = validacionRepository.findById(proyecto.getIdValidacion());
					estatusPresupuesto = validacionPresu.getCsEstatus();
					proyDto.setIdValidacion(proyecto.getIdValidacion());
				}
				proyDto.setEstatusPresupuesto(estatusPresupuesto);

				// Validar estauts de planeación
				String estatusPlaneacion = "P"; // pendiente por validar
				if (proyecto.getIdValidacionPlaneacion() != null) {
					MetValidacionEntity validacionPlan = validacionRepository
							.findById(proyecto.getIdValidacionPlaneacion());
					estatusPlaneacion = validacionPlan.getCsEstatus();
					proyDto.setIdValidacionPlaneacion(proyecto.getIdValidacionPlaneacion());
				}
				proyDto.setEstatusPlaneacion(estatusPlaneacion);

				// Validar estauts de Supervisor
				String estatusSupervisor = "P";
				if (proyecto.getIdValidacionSupervisor() != null) {
					MetValidacionEntity validacionPlanSuper = validacionRepository
							.findById(proyecto.getIdValidacionSupervisor());
					estatusSupervisor = validacionPlanSuper.getCsEstatus();
					proyDto.setIdValidacionSupervisor(proyecto.getIdValidacionSupervisor());
				}
				proyDto.setEstatusSupervisor(estatusSupervisor);

				Log.debug(proyecto.getArchivo().getCxUuid());

				ProyectoContribucion contribucionEspecial = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 2)
						.firstResult();
				List<ProyectoContribucion> contribucionesObjetivo = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 1)
						.list();
				List<ProyectoContribucion> contribucionesPNC = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 3)
						.list();
				List<ContribucionCatalogo> contribucionesObj = new ArrayList<ContribucionCatalogo>();
				for (ProyectoContribucion contribucionObjetivo : contribucionesObjetivo) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();

					contribucion.setIdCatalogo(contribucionObjetivo.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionObjetivo.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(1);
					contribucionesObj.add(contribucion);
				}
				proyDto.setContribucionObjetivoPrioritarioPI(contribucionesObj);
				List<ContribucionCatalogo> contribucionesPNCDto = new ArrayList<ContribucionCatalogo>();
				if (null != contribucionEspecial)
					proyDto.setContribucionProgramaEspecial(contribucionEspecial.getContribucion().getIdCatalogo());
				for (ProyectoContribucion contribucionPNC : contribucionesPNC) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();
					contribucion.setIdCatalogo(contribucionPNC.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionPNC.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(3);

					contribucionesPNCDto.add(contribucion);
				}
				proyDto.setContribucionPNCCIMGP(contribucionesPNCDto);

				List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = generarArrayArchivos(proyecto);
				proyDto.setArchivos(archivosDto);
				proyectosVO.add(proyDto);
			}

			respuesta.setProyecto(proyectosVO);
		} else {
			Mensaje mensajeError = new Mensaje("400", "No encontró registros.");
			respuesta.setMensaje(mensajeError);
		}

		return respuesta;
	}

	@Override
	public RespuestaProyectos consultaProyectosParaValidar(int idAnhio) {
		RespuestaProyectos respuesta = new RespuestaProyectos();
		List<ProyectoAnual> proyectos = proyectoAnualRepository.findAllByYearAndEstatusOnlyFromCortoPlazo(idAnhio,
				List.of("A", "C", "E", "I", "O", "R", "P", "T", "V", "1", "2", "3", "4", "5"));
		Mensaje mensaje = new Mensaje("200", "Exitoso");
		if (!proyectos.isEmpty()) {

			List<Proyecto> proyectosVO = new ArrayList<Proyecto>();
			for (ProyectoAnual proyecto : proyectos) {

				respuesta.setMensaje(mensaje);
				Proyecto proyDto = new Proyecto();
				proyDto.setIdProyecto(proyecto.getIdProyecto());
				proyDto.setNombreUnidad(proyecto.getCxNombreUnidad());
				proyDto.setClaveUnidad(proyecto.getCveUnidad());

				proyDto.setIxCicloValidacion(proyecto.getIxCicloValidacion());
				proyDto.setEstatus(proyecto.getCsEstatus());

				// Recuperar el estatus de presupuesto
				String estatusPresupuesto = "P"; // pendiente por validar
				if (proyecto.getIdValidacion() != null) {
					MetValidacionEntity validacionPresu = validacionRepository.findById(proyecto.getIdValidacion());
					estatusPresupuesto = validacionPresu.getCsEstatus();
					proyDto.setIdValidacion(proyecto.getIdValidacion());
				}
				proyDto.setEstatusPresupuesto(estatusPresupuesto);

				// Validar estauts de planeación
				String estatusPlaneacion = "P"; // pendiente por validar
				if (proyecto.getIdValidacionPlaneacion() != null) {
					MetValidacionEntity validacionPlan = validacionRepository
							.findById(proyecto.getIdValidacionPlaneacion());
					estatusPlaneacion = validacionPlan.getCsEstatus();
					proyDto.setIdValidacionPlaneacion(proyecto.getIdValidacionPlaneacion());
				}
				proyDto.setEstatusPlaneacion(estatusPlaneacion);

				// Validar estauts de Supervisor
				String estatusSupervisor = "P";
				if (proyecto.getIdValidacionSupervisor() != null) {
					MetValidacionEntity validacionPlanSuper = validacionRepository
							.findById(proyecto.getIdValidacionSupervisor());
					estatusSupervisor = validacionPlanSuper.getCsEstatus();
					proyDto.setIdValidacionSupervisor(proyecto.getIdValidacionSupervisor());
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
				proyDto.setDfRegistro(proyecto.getDfProyecto());
				proyDto.setDhRegistro(proyecto.getDhProyecto());
				proyDto.setCveUsuarioActualiza(proyecto.getCveUsuarioActualiza());

				ProyectoContribucion contribucionEspecial = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 2)
						.firstResult();
				List<ProyectoContribucion> contribucionesObjetivo = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 1)
						.list();
				List<ProyectoContribucion> contribucionesPNC = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 3)
						.list();
				List<ContribucionCatalogo> contribucionesObj = new ArrayList<ContribucionCatalogo>();
				for (ProyectoContribucion contribucionObjetivo : contribucionesObjetivo) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();

					contribucion.setIdCatalogo(contribucionObjetivo.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionObjetivo.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(1);
					contribucionesObj.add(contribucion);
				}
				proyDto.setContribucionObjetivoPrioritarioPI(contribucionesObj);
				List<ContribucionCatalogo> contribucionesPNCDto = new ArrayList<ContribucionCatalogo>();
				if (null != contribucionEspecial)
					proyDto.setContribucionProgramaEspecial(contribucionEspecial.getContribucion().getIdCatalogo());
				for (ProyectoContribucion contribucionPNC : contribucionesPNC) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();
					contribucion.setIdCatalogo(contribucionPNC.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionPNC.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(3);

					contribucionesPNCDto.add(contribucion);
				}
				proyDto.setContribucionPNCCIMGP(contribucionesPNCDto);
				List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = generarArrayArchivos(proyecto);
				proyDto.setArchivos(archivosDto);
				proyectosVO.add(proyDto);
			}

			respuesta.setProyecto(proyectosVO);
		} else {
			Mensaje mensajeError = new Mensaje("400", "No encontró registros.");
			respuesta.setMensaje(mensajeError);
		}

		return respuesta;
	}

	@Override
	public RespuestaProyectos consultaProyectosCarga(int idAnhio, int idProyecto) {
		RespuestaProyectos respuesta = new RespuestaProyectos();
		List<ProyectoAnual> proyectos;

		if (idAnhio > 0) {
			var estatus = List.of("C", "I");

			proyectos = proyectoAnualRepository.findAllByYearOriginAndEstatusOnlyFromCortoPlazo(idAnhio, 1, estatus);
		} else {
			proyectos = proyectoAnualRepository
					.find("idProyecto = ?1 and ix_fuente_registro = 1 and csEstatus in ('C','I')", idProyecto).list();
		}

		Mensaje mensaje = new Mensaje("200", "Exitoso");
		if (!proyectos.isEmpty()) {

			List<Proyecto> proyectosVO = new ArrayList<Proyecto>();
			for (ProyectoAnual proyecto : proyectos) {

				respuesta.setMensaje(mensaje);
				Proyecto proyDto = new Proyecto();
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
				Log.debug(proyecto.getArchivo().getCxUuid());

				ProyectoContribucion contribucionEspecial = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 2)
						.firstResult();
				List<ProyectoContribucion> contribucionesObjetivo = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 1)
						.list();
				List<ProyectoContribucion> contribucionesPNC = contribucionRepository
						.find("proyectoAnual.idProyecto = ?1 and ixTipoContri = ?2", proyecto.getIdProyecto(), 3)
						.list();
				List<ContribucionCatalogo> contribucionesObj = new ArrayList<ContribucionCatalogo>();
				for (ProyectoContribucion contribucionObjetivo : contribucionesObjetivo) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();

					contribucion.setIdCatalogo(contribucionObjetivo.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionObjetivo.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(1);
					contribucionesObj.add(contribucion);
				}
				proyDto.setContribucionObjetivoPrioritarioPI(contribucionesObj);
				List<ContribucionCatalogo> contribucionesPNCDto = new ArrayList<ContribucionCatalogo>();
				if (null != contribucionEspecial)
					proyDto.setContribucionProgramaEspecial(contribucionEspecial.getContribucion().getIdCatalogo());
				for (ProyectoContribucion contribucionPNC : contribucionesPNC) {
					ContribucionCatalogo contribucion = new ContribucionCatalogo();
					contribucion.setIdCatalogo(contribucionPNC.getContribucion().getIdCatalogo());
					contribucion.setIdSecContribucion(contribucionPNC.getIdProycontri());
					contribucion.setIdProyecto(proyecto.getIdProyecto());
					contribucion.setTipoContribucion(3);

					contribucionesPNCDto.add(contribucion);
				}
				proyDto.setContribucionPNCCIMGP(contribucionesPNCDto);

				List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = generarArrayArchivos(proyecto);
				proyDto.setArchivos(archivosDto);
				proyectosVO.add(proyDto);
			}

			respuesta.setProyecto(proyectosVO);
		} else {
			Mensaje mensajeError = new Mensaje("400", "No encontró registros.");
			respuesta.setMensaje(mensajeError);
		}

		return respuesta;
	}

	private List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> generarArrayArchivos(ProyectoAnual proyecto) {
		List<mx.edu.sep.dgtic.mejoredu.comun.Archivo> archivosDto = new ArrayList<>();
		mx.edu.sep.dgtic.mejoredu.comun.Archivo archivoDto = new mx.edu.sep.dgtic.mejoredu.comun.Archivo();
		archivoDto.setEstatus(proyecto.getArchivo().getCsEstatus());
		archivoDto.setNombre(proyecto.getArchivo().getCxNombre());
		var ultimoarchivo = archivoRepository.find("cxNombre = ?1", proyecto.getArchivo().getCxNombre()).list();
		for (int i = 0; i < ultimoarchivo.size(); i++) {
			if (i == ultimoarchivo.size() - 1) {
				archivoDto.setUuidToPdf(ultimoarchivo.get(i).getCxUuidToPdf());
			} else {
				archivoDto.setUuidToPdf(null);

			}
		}
		archivoDto.setUsuario(proyecto.getUsuario().getCveUsuario());
		archivoDto.setUuid(proyecto.getArchivo().getCxUuid());
		archivoDto.setIdArchivo(proyecto.getArchivo().getIdArchivo());
		archivosDto.add(archivoDto);
		return archivosDto;
	}

	@Override
	@Transactional
	public RespuestaGenerica registrarProyectoAnual(PeticionProyecto peticionProyecto) {
		ProyectoAnual proyecto = new ProyectoAnual();
		// Fundamentación falta proyecto.set
		// Alcance falta proyecto.set
		proyecto.setCsEstatus(peticionProyecto.getCsEstatus());
		proyecto.setIxCicloValidacion(0);
		proyecto.setItSemantica(1);
//		List<ProyectoContribucion> contribuciones = contribucionRepository
//				.find("proyectoAnual.idProyecto", peticionProyecto.getIdProyecto()).list();
//		proyecto.setProyectoContribucion( contribuciones);

		/// Registar varias contribuciones

		proyecto.setCxObjetivo(peticionProyecto.getObjetivo());
		proyecto.setCxObjetivoPrioritario(peticionProyecto.getObjetivoPriori());
		proyecto.setCveProyecto(peticionProyecto.getCveProyecto());
		proyecto.setCxNombreProyecto(peticionProyecto.getNombreProyecto());
		proyecto.setCxAlcance(peticionProyecto.getAlcance());
		proyecto.setCxFundamentacion(peticionProyecto.getFundamentacion());
		proyecto.setCxNombreUnidad(peticionProyecto.getNombreUnidad());
		proyecto.setCveUnidad(peticionProyecto.getClaveUnidad());
		proyecto.setDhProyecto(LocalTime.now());
		proyecto.setDfProyecto(LocalDate.now());

		if (peticionProyecto.getClaveUnidad() != null) {
			MasterCatalogo catalogoUnidad = catalogoRepository
					.find("ccExterna=?1 and MasterCatalogo2.idCatalogo=2059 and dfBaja is null ",
							peticionProyecto.getClaveUnidad())
					.firstResult();
			proyecto.setUnidadAdministrativa(catalogoUnidad);
		} else {
			return new RespuestaGenerica("500",
					"Error no existe la unidad administrativa especificada : " + peticionProyecto.getClaveUnidad());
		}
		AnhoPlaneacion anhio = anhoPlaneacionRespository.findById(peticionProyecto.getIdAnhio());
		Usuario usuario = usuarioRepository.findById(peticionProyecto.getCveUsuario());
		proyecto.setAnhoPlaneacion(anhio);
		proyecto.setUsuario(usuario);

		Archivo archivoAlf = new Archivo();
		Log.debug(peticionProyecto.getArchivos().get(0).getEstatus());
		archivoAlf.setCsEstatus(peticionProyecto.getArchivos().get(0).getEstatus());
		archivoAlf.setCxNombre(peticionProyecto.getArchivos().get(0).getNombre());
		archivoAlf.setUsuario(usuarioRepository.findById(peticionProyecto.getArchivos().get(0).getUsuario()));
		archivoAlf.setCxUuid(peticionProyecto.getArchivos().get(0).getUuid());
		String uuidPDF = null;
		try {
			uuidPDF = this.getUiidPdfAlfresco(peticionProyecto.getArchivos().get(0).getUuid());
			// uuidPDF = "SDDF-SDFGSDSDF-SDFGSDFGS-SDFG";

			archivoAlf.setCxUuidToPdf(uuidPDF);
		} catch (NotOfficeXmlFileException e) {
			return new RespuestaGenerica("500",
					"Error al leer el archivo, por favor valida que no este dañado o intenta con otro.");
		}
		archivoAlf.setDfFechaCarga(LocalDate.now());
		archivoAlf.setDfHoraCarga(LocalTime.now());
		TipoDocumento tipoDoc = new TipoDocumento();
		tipoDoc.setIdTipoDocumento(1);
		archivoAlf.setTipoDocumento(tipoDoc);
		archivoRepository.persistAndFlush(archivoAlf);
		Archivo archivoInto = archivoRepository.find("cxUuid", peticionProyecto.getArchivos().get(0).getUuid())
				.firstResultOptional().orElseThrow(() -> new NotFoundException(
						"No se encontró el archivo con uuid " + peticionProyecto.getArchivos().get(0).getUuid()));
		proyecto.setArchivo(archivoInto);

		// Guardar proyecto+
		proyectoAnualRepository.persist(proyecto);

		guardarContribuciones(proyecto, peticionProyecto);
		if (uuidPDF == null) {
			return new RespuestaGenerica("202",
					"El Documento no tiene texto, por favor valida que no este dañado o intenta con otro.");
		} else {
			return new RespuestaGenerica("200", "Exitoso");
		}
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

//	private OutputStream subirPDF2Alfresco(String uuid) {
//		ConverterPDF converterPDF = new ConverterPDF();
//
//		InputStream archivoAConvertir = null;
//		OutputStream archivoPDF = converterPDF.convertToPDF(archivoAConvertir);
//	}

	private void guardarContribuciones(ProyectoAnual proyectoGenerado, PeticionProyecto peticionProyecto) {
		// Contribucón especial
		if (peticionProyecto.getContribucionProgramaEspecial() != null) {
			var contribucionEspecial = catalogoRepository
					.findByIdOptional(peticionProyecto.getContribucionProgramaEspecial())
					.orElseThrow(() -> new NotFoundException("No se encontró la contribución programa especial con id "
							+ peticionProyecto.getContribucionProgramaEspecial()));
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
	public MensajePersonalizado<Integer> secuencialProyectoAnual(Integer idAnhio, Integer idUnidad) {

		MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		// -Recuperar secuencia de la unidad
		var secuenciaPorUnidad = secuenciadorRepository.find("idAnhio = ?1 and unidadAdmiva.idCatalogo = ?2", idAnhio, idUnidad).firstResult();

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

		if (secuenciaPorUnidad.getIdSecuencia() == null)
			secAdmiva = 1;
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
			Log.error("Error al calcular y pesistir la secuencia por unidad admiva", e);
		}
		return respuesta;
	}

	@Override
	@Transactional
	@lombok.SneakyThrows
	public RespuestaGenerica cargaExcel(InputStream file, String cveUsuario) {

		ProyectoAnual registro = new ProyectoAnual();
		TipoDocumento tipoDocumento = tipoDocumentoRepository.findByExtension("pdf");
		Archivo archivo = new Archivo();
//		Usuario usuario = usuarioRepository.findById(cveUsuario);
		var perfilLaboral = perfilLaboralRepository.findByCveUsuario(cveUsuario)
				.orElseThrow(() -> new NotFoundException("No se encontró el perfil laboral del usuario"));
		MasterCatalogo unidad = null;
		// cuando sea un usuario ENLACE debe de registrar la unidad del usuario!
		if (perfilLaboral.getUsuario().getTipoUsuario().getCdTipoUsuario()
				.equals(TipoUsuarioEnum.ENLACE.getCdTipoUsuario())) {
			unidad = perfilLaboral.getCatalogoUnidad();
		}

		try {
			@SuppressWarnings("resource")
			Workbook workbook = new XSSFWorkbook(file); // Cargar el archivo Excel en el objeto Workbook;
			int NumeroDeHojas = workbook.getNumberOfSheets();
			Log.info("NumeroDeHojas" + NumeroDeHojas);

			Sheet proyectos = workbook.getSheetAt(0); // Hoja asociada a proyectos

			for (Row row : proyectos) {
				if (row.getRowNum() > 0) {
					if (row.getCell(0) == null) {
						break;
					}
					if (row.getCell(2) == null) {
						throw new BadRequestException(
								"El nombre del proyecto en la pestaña de proyectos, no puede ser nulo; favor de revisar tu archivo. ");
					}
					String nombreProyectoFile = row.getCell(0).getStringCellValue();
					if (nombreProyectoFile == null || ObjectUtils.isEmpty(nombreProyectoFile)) {
						throw new BadRequestException(
								"La clave de proyecto en la pestaña de proyectos, no puede ser nulo; favor de revisar tu archivo. ");
					}
					String objetivo = row.getCell(1).getStringCellValue();
					if (objetivo == null || ObjectUtils.isEmpty(objetivo)) {
						throw new BadRequestException(
								"El objetivo del proyecto en la pestaña de proyectos, no puede ser nulo; favor de revisar tu archivo. ");
					}
					int idAnio = (int) row.getCell(2).getNumericCellValue();
					String nombreUnidad = row.getCell(3).getStringCellValue();
					Log.info("NombreUnidad: " + nombreUnidad);
					String alcance = row.getCell(4).getStringCellValue();
					Log.info("Alcance: " + alcance);
					String fundamentacion = row.getCell(5).getStringCellValue();
					Log.info("Fundamentacion: " + fundamentacion);
					String cveUnidad = row.getCell(6).getStringCellValue();
					Log.info("Fundamentacion: " + fundamentacion);

					if (row.getCell(2) != null) {
						AnhoPlaneacion anhio = anhoPlaneacionRespository.findById(idAnio);
						registro.setAnhoPlaneacion(anhio);
					} else {
						AnhoPlaneacion anhio = anhoPlaneacionRespository.findById(2023);
						registro.setAnhoPlaneacion(anhio);
					}

					// Cuando el excel lo cargue un usuario ADMINISTRADOR debe de tomar la unidad
					// del excel
					if (perfilLaboral.getUsuario().getTipoUsuario().getCdTipoUsuario()
							.equals(TipoUsuarioEnum.ADMINISTRADOR.getCdTipoUsuario())) {
						List<MasterCatalogo> catalogoUnidad = catalogoRepository
								.find("MasterCatalogo2.idCatalogo=?1 and ccExterna=?2 or idCatalogo=?3", 1978,
										cveUnidad, Integer.valueOf(cveUnidad))
								.list();
						unidad = catalogoUnidad.get(0);
					}
					int cveProyecto = this.secuencialProyectoAnual(idAnio, unidad.getIdCatalogo()).getRespuesta();

					registro.setCveProyecto(cveProyecto);
					registro.setCxNombreProyecto(nombreProyectoFile);
					registro.setCxObjetivo(objetivo);
					registro.setCxNombreUnidad(unidad.getCdOpcion());
					registro.setCxAlcance(alcance);
					registro.setCxFundamentacion(fundamentacion);
					registro.setCveUnidad(unidad.getCcExterna().toString());
					registro.setCsEstatus(EstatusEnum.INACTIVO.getEstatus());
					registro.setIx_fuente_registro(1);
					registro.setLockFlag(0);
					registro.setItSemantica(1);
					registro.setUnidadAdministrativa(unidad);

					Archivo obtenerArchivo = archivoRepository.findByNombre("PruebasExcel");
					if (cveUsuario != null && cveUsuario != "") {
						if (perfilLaboral.getUsuario() != null) {
							archivo.setUsuario(perfilLaboral.getUsuario());
							registro.setUsuario(perfilLaboral.getUsuario());
							registro.setArchivo(obtenerArchivo);
						} else {
							throw new WebApplicationException("No se encontro el usuario");
						}
					}
					ProyectoAnual nombreProyecto = proyectoAnualRepository.findByNombre(nombreProyectoFile);
					if (nombreProyecto == null) {
						if (obtenerArchivo == null) {
							archivo.setCsEstatus("A");
							archivo.setCxNombre("PruebaExcel");
							archivo.setCxUuid("00000000");
							archivo.setCxUuidToPdf("d9468b9e-78a6-400b-a681-7e753e4d3622");
							archivo.setDfFechaCarga(LocalDate.now());
							archivo.setDfHoraCarga(LocalTime.now());
							registro.setArchivo(archivo);

							archivo.setTipoDocumento(tipoDocumento);
							archivoRepository.persist(archivo);
						}
					} else {
						throw new BadRequestException(
								"Ya existe un Proyecto con el mismo nombre, favor de revisar tu archivo. ");
					}

					proyectoAnualRepository.persist(registro);

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
						int cveActividad = (int) row.getCell(0).getNumericCellValue();
						entidad.setCveActividad(cveActividad);
						// entidad.setDfActividad(new Date(2023,11,26));

						if (row.getCell(1) == null) {
							throw new BadRequestException(
									"El nombre de la actividad en la pestaña de actividades, no puede ser nulo; favor de revisar tu archivo. ");
						}
						entidad.setCxNombreActividad(row.getCell(1).getStringCellValue());

						if (row.getCell(2) != null) {
							entidad.setCxDescripcion(row.getCell(2).getStringCellValue());
						}

						if (row.getCell(3) == null) {
							throw new BadRequestException(
									"La articulación de la actividad en la pestaña de actividades, no puede ser nula; favor de revisar tu archivo. ");
						}
						entidad.setCxArticulacionActividad(row.getCell(3).getStringCellValue());
						entidad.setCsEstatus("I");

						if (row.getCell(4) != null) {
							entidad.setIcActividadTransversal(row.getCell(4).getStringCellValue().equals("si") ? 1 : 0);
						}
						if (row.getCell(5) != null) {
							entidad.setIxRequireReunion(row.getCell(5).getStringCellValue().equals("si") ? 1 : 0);
						}
						if (row.getCell(6) != null) {
							entidad.setCxTema(row.getCell(6).getStringCellValue());
						}
						if (row.getCell(7) != null) {
							int idCatalogoAlcance = (int) row.getCell(7).getNumericCellValue();
							var alcance = catalogoRepository.findById(idCatalogoAlcance);
							if (alcance == null) {
								throw new NotFoundException("No existe el alcance con id " + idCatalogoAlcance);
							}
							entidad.setCatalogoAlcance(alcance);
						}
						if (row.getCell(8) != null) {
							entidad.setCxLugar(row.getCell(8).getStringCellValue());
						}
						if (row.getCell(9) != null) {
							entidad.setCxActores(row.getCell(9).getStringCellValue());
						}

						var usuarios = usuarioRepository.findById(cveUsuario);
						if (usuarios == null) {
							throw new NotFoundException("No existe el usuario con id " + cveUsuario);
						}
						entidad.setUsuario(perfilLaboral.getUsuario());

						List<ProyectoAnual> maxi = proyectoAnualRepository.listAll();
						Log.info("maxi.size() " + maxi.size());
						Log.info(
								"maxi.get(maxi.size()-1).getIdProyecto() " + maxi.get(maxi.size() - 1).getIdProyecto());
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
							throw new BadRequestException(
									"La descripción  en la pestaña de productos, no puede ser nula; favor de revisar su archivo. ");
						}
						String campo2 = row.getCell(1).getStringCellValue();
						producto.setCxDescripcion(campo2);
						if (row.getCell(2) == null) {
							throw new BadRequestException(
									"La vinculacion  en la pestaña de productos, no puede ser nula; favor de revisar su archivo. ");
						}
						String campo3 = row.getCell(2).getStringCellValue();
						producto.setCxVinculacionProducto(campo3);
						if (row.getCell(3) != null) {
							String campo4 = row.getCell(3).getStringCellValue();
							producto.setCbPorPublicar(campo4);
						}
						if (row.getCell(4) == null) {
							throw new BadRequestException(
									"La clave de actividad  en la pestaña de productos, es obligatoria; favor de revisar su archivo. ");
						}
						int campo5 = (int) row.getCell(4).getNumericCellValue();
						idActividadAnterior = idActividad;
						var actividadPorClaveActividad = actividadRepository.findByCveActividadAndIdProyecto(campo5,
								idProyectoCreado);
						if (ObjectUtils.isEmpty(actividadPorClaveActividad)) {
							throw new BadRequestException(
									"No existe actividad  que corresponda a la clave de actividad " + campo5
											+ "; favor de revisar su archivo. ");
						}
						Log.info("actividadPorClaveActividad.list().get(0).getIdActividad() "
								+ actividadPorClaveActividad.list().get(0).getIdActividad());
						var actividad = actividadRepository
								.findById(actividadPorClaveActividad.list().get(0).getIdActividad());
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
							throw new BadRequestException(
									"El id_catalogo_tipo_producto en la pestaña de productos, es obligatorio;\n  favor de revisar su archivo. ");
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
							throw new BadRequestException(
									"El id_catalogo_nivel_educativo en la pestaña de productos, es obligatorio;\n  favor de revisar su archivo. ");
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

							var anioPublicacion = catalogoRepository
									.find("MasterCatalogo2.idCatalogo = 845 and cdOpcion=?1", campo13).firstResult();
							if (anioPublicacion == null) {
								throw new NotFoundException("No existe el anioPublicacion con id " + campo13);
							}
							producto.setAnhioPublicacion(campo13); // Se guarda el valor natural de año no el ID
						}

						producto.setUsuario(perfilLaboral.getUsuario());
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

		// Cambiar el estatus de presupuesto a P
		if (proyecto.getIdValidacion() != null) {
			MetValidacionEntity validacionPresupuesto = validacionRepository.findById(proyecto.getIdValidacion());

			validacionPresupuesto.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());
			validacionRepository.persistAndFlush(validacionPresupuesto);

		}
		// Cambiar el estatus de planeación a P
		if (proyecto.getIdValidacionPlaneacion() != null) {
			MetValidacionEntity validacionPlaneacion = validacionRepository
					.findById(proyecto.getIdValidacionPlaneacion());

			validacionPlaneacion.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());
			validacionRepository.persistAndFlush(validacionPlaneacion);

		}
		// Cambiar el estatus de supervisor a P
		if (proyecto.getIdValidacionSupervisor() != null) {
			MetValidacionEntity validacionSupervisor = validacionRepository
					.findById(proyecto.getIdValidacionSupervisor());

			validacionSupervisor.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());
			validacionRepository.persistAndFlush(validacionSupervisor);

		}

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
				archivoActual.setCsEstatus("B");
				archivoActual.setUsuario(usuario);
				archivoRepository.persistAndFlush(archivoActual);
			}

			// Registramos el nuevo archivo

			Archivo archivo = new Archivo();
			archivo.setCsEstatus("A");
			archivo.setCxNombre(peticionProyecto.getArchivo().getNombre());
			archivo.setCxUuid(peticionProyecto.getArchivo().getUuid());
			archivo.setCxUuidToPdf(getUiidPdfAlfresco(peticionProyecto.getArchivo().getUuid()));
			archivo.setDfFechaCarga(LocalDate.now());
			archivo.setDfHoraCarga(LocalTime.now());
			archivo.setUsuario(usuario);
			TipoDocumento tipo = new TipoDocumento();
			tipo.setIdTipoDocumento(1);
			archivo.setTipoDocumento(tipo);
			archivoRepository.persistAndFlush(archivo);
			Archivo archivoGenerado = archivoRepository.find("cxUuid", peticionProyecto.getArchivo().getUuid())
					.firstResult();

			proyecto.setArchivo(archivoGenerado);

		}
		if (peticionProyecto.getCveProyecto() == null) {
			throw new BadRequestException(
					"El campo cveProyecto no puede enviarse nulo en la peticion para este idProyecto " + idProyecto
							+ ", Favor de agregarlo a la petición.");
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
		proyecto.setCsEstatus(peticionProyecto.getCsEstatus().getEstatus());

		// ********************************

		proyecto.setCxAlcance(peticionProyecto.getCxAlcance());
		proyecto.setCxFundamentacion(peticionProyecto.getCxFundamentacion());
		proyecto.setCxNombreUnidad(peticionProyecto.getCxNombreUnidad());
		proyecto.setCveUnidad(peticionProyecto.getCveUnidad());
		if (peticionProyecto.getCveUnidad() != null) {
			MasterCatalogo catalogoUnidad = catalogoRepository
					.find("ccExterna=?1 and MasterCatalogo2.idCatalogo=2059 and dfBaja is null ", peticionProyecto.getCveUnidad())
					.firstResult();
			proyecto.setUnidadAdministrativa(catalogoUnidad);
		} else {
			return new RespuestaGenerica("500",
					"Error no existe la unidad administrativa especificada : " + peticionProyecto.getCveUnidad());
		}
		// ACtualizar contribuciones
		contribucionRepository.delete("proyectoAnual.idProyecto", proyecto.getIdProyecto());
		guardarContribuciones(proyecto, peticionProyecto);
		proyectoAnualRepository.persistAndFlush(proyecto);
		if (peticionProyecto.getArchivo() != null) {
			if (peticionProyecto.getArchivo().getUuid() == null)
				return new RespuestaGenerica("202", "El Documento esta en blanco, por favor valida el documento");
			else {
				return new RespuestaGenerica("200", "Exitoso");
			}
		} else {
			return new RespuestaGenerica("200", "Exitoso");
		}
	}

	private void guardarContribuciones(ProyectoAnual proyectoGenerado, ActualizarProyectoAnual peticionProyecto) {
		// Contribucón especial
		ProyectoContribucion contribucion = new ProyectoContribucion();
		if (peticionProyecto.getContribucionProgramaEspecial() != null) {
			contribucion.setProyectoAnual(proyectoGenerado);
			contribucion.setIxTipoContri(2);
			contribucion
					.setContribucion(catalogoRepository.findById(peticionProyecto.getContribucionProgramaEspecial()));
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
	public RespuestaProyectosVistaGeneral consultaProyectosParaVistaGeneral(int idAnhio, String cveUsuario) {
		RespuestaProyectosVistaGeneral respuesta = new RespuestaProyectosVistaGeneral();
		var usuario = usuarioRepository.findByIdOptional(cveUsuario)
				.orElseThrow(() -> new BadRequestException("No se encontró el usuario con clave " + cveUsuario));

		List<ProyectoAnual> proyectosAnuales;
		if (usuario.hasReadPermission()) {
			var estatus = List.of(EstatusEnum.COMPLETO.getEstatus(), EstatusEnum.PORREVISAR.getEstatus(),
					EstatusEnum.FINALIZADO.getEstatus());

			proyectosAnuales = proyectoAnualRepository.findAllByYearSemanticaAndEstatusOnlyFromCortoPlazo(idAnhio, 1,
					estatus);
		} else {
			List<PerfilLaboral> perfilLaboralList = perfilLaboralRepository.find("usuario.cveUsuario = ?1", cveUsuario)
					.list();
			int idUnidad = perfilLaboralList.get(0).getCatalogoUnidad().getIdCatalogo();

			var estatus = List.of(EstatusEnum.COMPLETO.getEstatus(), EstatusEnum.PORREVISAR.getEstatus(),
					EstatusEnum.FINALIZADO.getEstatus());

			proyectosAnuales = proyectoAnualRepository.findAllByYearSemanticaUnidadAndEstatusOnlyFromCortoPlazo(idAnhio,
					1, idUnidad, estatus);
		}

		Mensaje mensaje = new Mensaje("200", "Exitoso");

		if (!proyectosAnuales.isEmpty()) {

			List<ProyectosVO> proyectos = new ArrayList<ProyectosVO>();
			for (var proyecto : proyectosAnuales) {
				respuesta.setMensaje(mensaje);

				ProyectosVO proyDto = new ProyectosVO();
				proyDto.setIdProyecto(proyecto.getIdProyecto());
				proyDto.setNombreProyecto(proyecto.getCxNombreProyecto());
				proyDto.setObjetivo(proyecto.getCxObjetivo());
				proyDto.setEstatus(proyecto.getCsEstatus());
				proyDto.setCveProyecto(proyecto.getCveProyecto());
				proyDto.setCveUnidad(proyecto.getCveUnidad());
				proyDto.setAnhio(proyecto.getAnhoPlaneacion().getIdAnhio());
//        proyDto.setCveProgramaInstitucional(Collections.singletonList(proyecto.getCxObjetivoPrioritario()));

				var estatus = List.of(EstatusEnum.COMPLETO.getEstatus(), EstatusEnum.PORREVISAR.getEstatus(),
						EstatusEnum.FINALIZADO.getEstatus());

				var actividades = actividadRepository.findAllByProyectoAndEstatus(proyecto.getIdProyecto(), estatus);
				List<ActividadVistaGeneralVO> actividadVistaGeneral = new ArrayList<ActividadVistaGeneralVO>();

				for (Actividad actividad : actividades) {
					ActividadVistaGeneralVO actividadDto = new ActividadVistaGeneralVO();
//          actividadDto.setProgramaInstitucional("1.2." + programaInstitucional++);
					actividadDto.setIdActividad(actividad.getIdActividad());
					actividadDto.setCxNombreActividad(actividad.getCxNombreActividad());
					actividadDto.setCveActividad(actividad.getCveActividad());
					if (actividad.getCatalogoAlcance() != null) {
						actividadDto.setAgenda(actividad.getCatalogoAlcance().getIdCatalogo());
					} else {
						actividadDto.setAgenda(0);
					}
//          actividadDto.setAcuerdosSEP("Acuerdo sep 1");
//          actividadDto.setProyectosOEI("ProyectosOEI 1");
					actividadDto.setCsEstatus(actividad.getCsEstatus());

					var estatusP = List.of(EstatusEnum.COMPLETO.getEstatus(), EstatusEnum.PORREVISAR.getEstatus(),
							EstatusEnum.FINALIZADO.getEstatus());

					var productoPenache = productoRepository.findByIdActividadAndEstatus(actividad.getIdActividad(),
							estatusP);
					List<ProductoVO> productosVistageneral = new ArrayList<ProductoVO>();

					for (Producto producto : productoPenache) {
						ProductoVO productoVO = new ProductoVO();
						productoVO.setIdProducto(producto.getIdProducto());
						productoVO.setCategoria(catalogoRepository
								.findById(producto.getCategorizacion().get().getIdCatalogo()).getCdOpcion());
						productoVO.setTipo(catalogoRepository.findById(producto.getTipoProducto().get().getIdCatalogo())
								.getCdOpcion());
						productoVO.setCxEstatus(producto.getCsEstatus());
						String indicadorMIR = (producto.getIndicadorMIR().isPresent())
								? producto.getIndicadorMIR().get().getCdOpcion()
								: "0";
						String cveIndicadorMir = (producto.getIndicadorMIR().isPresent())
								? producto.getIndicadorMIR().get().getCcExternaDos()
								: "0";

						productoVO.setIndicadorMIR(indicadorMIR);
						productoVO.setCveIndicadorMIR(cveIndicadorMir);

						List<ProductoCalendarioVO> productoCalendarioVOList = new ArrayList<ProductoCalendarioVO>();
						if (producto.getProductoCalendario() != null) {
							producto.getProductoCalendario().stream().filter(calendario -> calendario.getCiMonto() > 0)
									.map(calendario -> {
										ProductoCalendarioVO productoCalendario = new ProductoCalendarioVO();
										productoCalendario.setMes(calendario.getCiMes());
										productoCalendario.setMonto(calendario.getCiMonto());
										productoCalendario.setIdProducto(calendario.getProducto().getIdProducto());
										productoCalendario
												.setIdProductoCalendario(calendario.getIdProductoCalendario());
										return productoCalendario;

									}).forEach(productoCalendarioVOList::add);
						}

						productoVO.setCalendario(productoCalendarioVOList);
//            productoVO.setCxClaveCompleta(producto.getCveProducto());
						productoVO.setCxNombreProducto(producto.getCxNombre());
//            productoVO.setAgendaAutoridades("Reuniones que van en la Agenda de Autoridades");

						var presupuestoPenache = presupuestoRepository.consultarPorProducto(producto.getIdProducto());
						List<PresupuestoVO> presupuestoVistaGeneral = new ArrayList<PresupuestoVO>();

						for (Presupuesto presupuesto : presupuestoPenache) {

							PanacheQuery<PartidaGasto> partidaGastoPenache;
							partidaGastoPenache = partidaGastoRepository.find("presupuesto.idPresupuesto = ?1",
									presupuesto.getIdPresupuesto());
							List<Calendarizacion> calendarizacion = new ArrayList<Calendarizacion>();

							for (PartidaGasto partidaGasto : partidaGastoPenache.list()) {

								List<PartidaPresupuestalVO> partidaPresupuestal = new ArrayList<PartidaPresupuestalVO>();
								PartidaPresupuestalVO partidaPresupuestalVO = new PartidaPresupuestalVO();
								List<Double> totalAnual = new ArrayList<>();
								PresupuestoVO presupuestoVO = new PresupuestoVO();
								if (partidaGasto.getIdPartida() != null) {
									if (partidaGasto.getCalendarios() != null) {
										partidaGasto.getCalendarios().stream()
												.filter(calendario -> calendario.getIxMonto() > 0).map(calendario -> {
													Calendarizacion cal = new Calendarizacion();
													cal.setMes(calendario.getIxMes());
													cal.setMonto(calendario.getIxMonto());
													cal.setNombrePartida(
															partidaGasto.getCatalogoPartida().getCdOpcion());
													totalAnual.add(calendario.getIxMonto());
													cal.setActivo(1);
													return cal;
												}).forEach(calendarizacion::add);
									}
									// PartidaPresupuestal
//									partidaPresupuestalVO
//											.setCxNombrePartida(partidaGasto.getCatalogoPartida().getCdOpcion());
									partidaPresupuestalVO
											.setIdCatalogoPartidaGasto(partidaGasto.getIdCatalogoPartida());
									partidaPresupuestalVO.setAnual(
											calendarizacion.stream().mapToDouble(Calendarizacion::getMonto).sum());
									partidaPresupuestalVO.setCalendarizacion(calendarizacion);
									partidaPresupuestal.add(partidaPresupuestalVO);
								}
								presupuestoVO.setCveAccion(presupuesto.getCveAccion());
								presupuestoVO.setIdPresupuesto(presupuesto.getIdPresupuesto());
								presupuestoVO.setCsEstatus(presupuesto.getCsEstatus());
								presupuestoVO.setCxNombrePresupuesto(presupuesto.getCxNombreAccion());
								presupuestoVO.setCxPartidaGasto(partidaPresupuestalVO);
								presupuestoVistaGeneral.add(presupuestoVO);
							}
						}
						productoVO.setCveProducto(producto.getCveProducto());
						productoVO.setCveCategorizacionProducto(producto.getCategorizacion().get().getIdCatalogo());
						productoVO.setCveTipoProducto(producto.getTipoProducto().get().getIdCatalogo());
						productoVO.setPOTIC(producto.getCxCvenombrePotic());
						productoVO.setPresupuestos(presupuestoVistaGeneral);
						productosVistageneral.add(productoVO);
					}

					// Order Productos by cveProducto
					productosVistageneral.sort(Comparator.comparing(ProductoVO::getCveProducto));

					actividadDto.setProductos(productosVistageneral);
					actividadVistaGeneral.add(actividadDto);

				}

				// Order Actividades by cveActividad
				actividadVistaGeneral.sort(Comparator.comparing(ActividadVistaGeneralVO::getCveActividad));

				proyDto.setActividades(actividadVistaGeneral);
				proyectos.add(proyDto);
			}

			// Order Proyectos by cveProyecto
			proyectos.sort(Comparator.comparing(ProyectosVO::getCveProyecto));

			respuesta.setProyecto(proyectos);
		} else {
			Mensaje mensajeError = new Mensaje("400", "No encontró registros.");
			respuesta.setMensaje(mensajeError);
		}
		return respuesta;
	}

	public RespuestaProyectosVistaGeneralPorID consultaProyectosParaVistaGeneralPorId(int idAnhio, String cveUsuario,
			int idProyecto) {
		RespuestaProyectosVistaGeneralPorID respuesta = new RespuestaProyectosVistaGeneralPorID();

		var usuario = usuarioRepository.findByIdOptional(cveUsuario)
				.orElseThrow(() -> new BadRequestException("No se encontró el usuario con clave " + cveUsuario));

		List<PerfilLaboral> perfilLaboralList = perfilLaboralRepository.find("usuario.cveUsuario = ?1", cveUsuario)
				.list();
		int idUnidad = perfilLaboralList.get(0).getCatalogoUnidad().getIdCatalogo();

		var proyectoPenache = proyectoAnualRepository.find("idProyecto = ?1 and anhoPlaneacion.idAnhio = ?2 ",
				idProyecto, idAnhio);
		Mensaje mensaje = new Mensaje("200", "Exitoso");
		if (proyectoPenache.count() > 0) {
			List<ProgramaInstitucionalVO> programaInstitucionalVOList = new ArrayList<ProgramaInstitucionalVO>();
			List<ProyectosVistaGeneralIdVO> proyectos = new ArrayList<ProyectosVistaGeneralIdVO>();
			for (ProyectoAnual proyecto : proyectoPenache.list()) {
				respuesta.setMensaje(mensaje);

				ProyectosVistaGeneralIdVO proyDto = new ProyectosVistaGeneralIdVO();
				proyDto.setIdProyecto(proyecto.getIdProyecto());

				List<VtEstrategiaActividadesEntity> estrategiaPenache;

				if (usuario.hasReadPermission()) {
					estrategiaPenache = estrategiaActividadRepository
							.list("idProyecto = ?1 and ixTipo = ?2 ORDER BY cveActividad", proyecto.getIdProyecto(), 2);
				} else {
					estrategiaPenache = estrategiaActividadRepository
							.list("idProyecto = ?1 and ixTipo = ?2 ORDER BY cveActividad", proyecto.getIdProyecto(), 2);
				}

				proyDto.setNombreProyecto(proyecto.getCxNombreProyecto());
				proyDto.setObjetivo(proyecto.getCxObjetivo());
				proyDto.setEstatus(proyecto.getCsEstatus());
				proyDto.setCveProyecto(proyecto.getCveProyecto());
				proyDto.setCveUnidad(proyecto.getCveUnidad());
				proyDto.setAnhio(proyecto.getAnhoPlaneacion().getIdAnhio());

				List<ActividadVistaGeneralVO> actividadVistaGeneral = new ArrayList<ActividadVistaGeneralVO>();
				for (VtEstrategiaActividadesEntity estrategiaActividadesEntity : estrategiaPenache) {
					Actividad actividad = actividadRepository.find("idActividad = ?1 and csEstatus = ?2",
							estrategiaActividadesEntity.getIdActividad(), EstatusEnum.COMPLETO.getEstatus())
							.firstResult();
					ActividadVistaGeneralVO actividadDto = new ActividadVistaGeneralVO();

					if (actividad != null) {
						actividadDto.setIdActividad(actividad.getIdActividad());
						actividadDto.setCxNombreActividad(actividad.getCxNombreActividad());
						actividadDto.setCsEstatus(actividad.getCsEstatus());
						actividadDto.setCveActividad(actividad.getCveActividad());

						if (actividad.getCatalogoAlcance() != null) {
							actividadDto.setAgenda(actividad.getCatalogoAlcance().getIdCatalogo());
						} else {
							actividadDto.setAgenda(null);
						}
					} else {
						actividadDto.setCsEstatus(null);
						actividadDto.setIdActividad(null);
						actividadDto.setCxNombreActividad(null);
						actividadDto.setCveActividad(null);
						actividadDto.setAgenda(null);
					}
//          actividadDto.setAcuerdosSEP("Acuerdo sep 1");
//          actividadDto.setProyectosOEI("ProyectosOEI 1");

					var productoPenache = productoRepository
							.find("actividad.idActividad = ?1 and csEstatus = ?2",
									estrategiaActividadesEntity.getIdActividad(), EstatusEnum.COMPLETO.getEstatus())
							.list();
					List<ProductoVO> productosVistageneral = new ArrayList<ProductoVO>();

					for (Producto producto : productoPenache) {
						ProductoVO productoVO = new ProductoVO();
						productoVO.setIdProducto(producto.getIdProducto());
						productoVO.setCategoria(catalogoRepository
								.findById(producto.getCategorizacion().get().getIdCatalogo()).getCdOpcion());
						productoVO.setTipo(catalogoRepository.findById(producto.getTipoProducto().get().getIdCatalogo())
								.getCdOpcion());
						productoVO.setCxEstatus(producto.getCsEstatus());
						String indicadorMIR = (producto.getIndicadorMIR().isPresent())
								? producto.getIndicadorMIR().get().getCdOpcion()
								: "0";
						String cveIndicadorMir = (producto.getIndicadorMIR().isPresent())
								? producto.getIndicadorMIR().get().getCcExternaDos()
								: "0";

						productoVO.setIndicadorMIR(indicadorMIR);
						productoVO.setCveIndicadorMIR(cveIndicadorMir);

						List<ProductoCalendarioVO> productoCalendarioVOList = new ArrayList<ProductoCalendarioVO>();
						if (producto.getProductoCalendario() != null) {
							producto.getProductoCalendario().stream().filter(calendario -> calendario.getCiMonto() > 0)
									.map(calendario -> {
										ProductoCalendarioVO productoCalendario = new ProductoCalendarioVO();
										productoCalendario.setMes(calendario.getCiMes());
										productoCalendario.setMonto(calendario.getCiMonto());
										productoCalendario.setIdProducto(calendario.getProducto().getIdProducto());
										productoCalendario
												.setIdProductoCalendario(calendario.getIdProductoCalendario());
										return productoCalendario;

									}).forEach(productoCalendarioVOList::add);
						}

						productoVO.setCalendario(productoCalendarioVOList);
//            productoVO.setCxClaveCompleta(producto.getCveProducto());
						productoVO.setCxNombreProducto(producto.getCxNombre());
//            productoVO.setAgendaAutoridades("Reuniones que van en la Agenda de Autoridades");

						var estatus = List.of(EstatusEnum.COMPLETO.getEstatus());

						var presupuestoPenache = presupuestoRepository
								.find("producto.idProducto = ?1 and csEstatus in ?2",producto.getIdProducto(), estatus).list();
						List<PresupuestoVO> presupuestoVistaGeneral = new ArrayList<PresupuestoVO>();

						for (Presupuesto presupuesto : presupuestoPenache) {
							PartidaPresupuestalVO partidaPresupuestalVO = new PartidaPresupuestalVO();
							PresupuestoVO presupuestoVO = new PresupuestoVO();
							PanacheQuery<PartidaGasto> partidaGastoPenache;
							partidaGastoPenache = partidaGastoRepository.find("presupuesto.idPresupuesto = ?1",
									presupuesto.getIdPresupuesto());
							List<PartidaPresupuestalVO> partidaPresupuestal = new ArrayList<PartidaPresupuestalVO>();
							List<Calendarizacion> calendarizacion = new ArrayList<Calendarizacion>();

							for (PartidaGasto partidaGasto : partidaGastoPenache.list()) {
								List<Double> totalAnual = new ArrayList<>();

								if (partidaGasto.getIdPartida() != null) {
									if (partidaGasto.getCalendarios() != null) {
										partidaGasto
												.getCalendarios().stream().filter(calendario -> Optional
														.ofNullable(calendario.getIxMonto()).orElse(0.0) > 0.0)
												.map(calendario -> {
													Calendarizacion cal = new Calendarizacion();
													cal.setMes(calendario.getIxMes());
													cal.setMonto(calendario.getIxMonto());
													cal.setNombrePartida(
															partidaGasto.getCatalogoPartida().getCdOpcion());
													totalAnual.add(calendario.getIxMonto());
													cal.setActivo(1);
													return cal;
												}).forEach(calendarizacion::add);
									}
									// PartidaPresupuestal
//									partidaPresupuestalVO
//											.setCxNombrePartida(partidaGasto.getCatalogoPartida().getCdOpcion());
									partidaPresupuestalVO
											.setIdCatalogoPartidaGasto(partidaGasto.getIdCatalogoPartida());
									partidaPresupuestalVO.setAnual(
											calendarizacion.stream().mapToDouble(Calendarizacion::getMonto).sum());
									partidaPresupuestalVO.setCalendarizacion(calendarizacion);
									partidaPresupuestal.add(partidaPresupuestalVO);
								}

							}
							presupuestoVO.setCveAccion(presupuesto.getCveAccion());
							presupuestoVO.setIdPresupuesto(presupuesto.getIdPresupuesto());
							presupuestoVO.setCsEstatus(presupuesto.getCsEstatus());
							presupuestoVO.setCxNombrePresupuesto(presupuesto.getCxNombreAccion());
							presupuestoVO.setCxPartidaGasto(partidaPresupuestalVO);
							presupuestoVistaGeneral.add(presupuestoVO);
						}
						productoVO.setCveProducto(producto.getCveProducto());
						productoVO.setCveCategorizacionProducto(producto.getCategorizacion().get().getIdCatalogo());
						productoVO.setCveTipoProducto(producto.getTipoProducto().get().getIdCatalogo());
						productoVO.setPOTIC(producto.getCxCvenombrePotic());
						if (!presupuestoVistaGeneral.isEmpty()) {
							productoVO.setPresupuestos(presupuestoVistaGeneral);
						}
						productosVistageneral.add(productoVO);
					}

					// Order Productos by cveProducto
					productosVistageneral.sort(Comparator.comparing(ProductoVO::getCveProducto));

					actividadDto.setProductos(productosVistageneral);
					if (actividad != null) {
						actividadVistaGeneral.add(actividadDto);
					}

				}
				if (!estrategiaPenache.isEmpty()) {
					for (int i = 0; i < estrategiaPenache.size(); i++) {
						int finalI = i;

						// Verificar si ya existe un objeto con la misma clave en la lista
						boolean existeEnLaLista = programaInstitucionalVOList.stream()
								.anyMatch(vo -> vo.getActividad().get(0).getCveActividad()
										.equals(estrategiaPenache.get(finalI).getCveActividad())
										&& vo.getClave().equals(estrategiaPenache.get(finalI).getCcExterna())
										&& !vo.getActividad().get(0).getProductos().isEmpty()
										|| vo.getActividad().get(0).getCveActividad()
												.equals(estrategiaPenache.get(finalI).getCveActividad())
												&& vo.getActividad().get(0).getCxNombreActividad()
														.equals(estrategiaPenache.get(finalI).getCxNombreActividad()));

						Map<Integer, ProgramaInstitucionalVO> listaCorregida = new HashMap<>();
						List<VtEstrategiaActividadesEntity> actividadFiltradaPorClave = estrategiaPenache.stream()
								.filter(filtro -> estrategiaPenache.get(finalI).getCveActividad()
										.equals(filtro.getCveActividad())
										&& estrategiaPenache.get(finalI).getCcExterna().equals(filtro.getCcExterna())
										&& estrategiaPenache.get(finalI).getIdActividad()
												.equals(filtro.getIdActividad()))
								.toList();
						List<ActividadVistaGeneralVO> actividadVistaGeneralVOList = new ArrayList<ActividadVistaGeneralVO>();
						// Si no existe, crea un nuevo objeto y agrégalo a la lista
						if (!existeEnLaLista) {
							ProgramaInstitucionalVO programaInstitucionalVO = new ProgramaInstitucionalVO();
							programaInstitucionalVO.setClave(estrategiaPenache.get(i).getCcExterna());

							for (VtEstrategiaActividadesEntity listaActi : actividadFiltradaPorClave) {
								actividadVistaGeneralVOList.add(actividadVistaGeneral.stream()
										.filter(filtro -> listaActi.getIdActividad().equals(filtro.getIdActividad()))
										.findFirst().orElse(null));
							}
							programaInstitucionalVO.setActividad(actividadVistaGeneralVOList);

							// Ordenar las actividades por cveActividad
							actividadVistaGeneralVOList
									.sort(Comparator.comparing(ActividadVistaGeneralVO::getCveActividad));
							programaInstitucionalVOList.add(programaInstitucionalVO);
						} else {
							int fin = programaInstitucionalVOList.size() - 1;
							if (programaInstitucionalVOList.get(fin).getClave()
									.equals(estrategiaPenache.get(finalI).getCcExterna())) {
								programaInstitucionalVOList.get(fin)
										.setClave(estrategiaPenache.get(finalI).getCcExterna());
							} else {
								programaInstitucionalVOList.get(fin)
										.setClave(programaInstitucionalVOList.get(fin).getClave() + ", "
												+ estrategiaPenache.get(finalI).getCcExterna());
							}

						}
					}
				} else {
					throw new NotFoundException("No se encontró registros.");
				}

				proyDto.setCveProgramaInstitucional(programaInstitucionalVOList);
//        proyDto.setActividades(actividadVistaGeneral);

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
	public List<ApartadoProyectoEstatus> consultarProyectoCompleto(int idProyecto) {
		var lstApartadoProyectoEstatusDTO = new ArrayList<ApartadoProyectoEstatus>();

		List<ProyectoCPApartadoEstatus> response = proyectoCPApartadoEstatusRepository.find("idProyecto", idProyecto)
				.list();
		response.stream().map(apartado -> {
			ApartadoProyectoEstatus apartadoProyectoEstatusDTO = new ApartadoProyectoEstatus();
			apartadoProyectoEstatusDTO.setApartado(apartado.getApartada());
			apartadoProyectoEstatusDTO.setEstatus(apartado.getCsEstatus());
			apartadoProyectoEstatusDTO.setId(apartado.getId());
			apartadoProyectoEstatusDTO.setIdProyecto(apartado.getIdProyecto());
			return apartadoProyectoEstatusDTO;
		}).forEach(lstApartadoProyectoEstatusDTO::add);
		return lstApartadoProyectoEstatusDTO;
	}
}
