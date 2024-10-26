package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.jasper.JasperReportResponse;
import mx.edu.sep.dgtic.mejoredu.rest.client.model.ResponseCreateFile;
import mx.sep.dgtic.mejoredu.seguimiento.HistoricoSolicitud;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionSolicitudDTO;
import mx.sep.dgtic.mejoredu.seguimiento.SolicitudDTO;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionProyecto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionSolicitud;
import mx.sep.dgtic.mejoredu.seguimiento.entity.MasterCatalogo;
import mx.sep.dgtic.mejoredu.seguimiento.entity.MehSolicitud;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Proyecto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SecuenciaFolioAnhio;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SecuenciaFolioSolicitud;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Solicitud;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Usuario;
import mx.sep.dgtic.mejoredu.seguimiento.rest.client.AlfrescoRestClient;
import mx.sep.dgtic.mejoredu.seguimiento.rest.client.MultipartBody;
import mx.sep.dgtic.mejoredu.seguimiento.service.AdecuacionService;
import mx.sep.dgtic.mejoredu.seguimiento.service.SolicitudSeguimientoService;
import mx.sep.dgtic.mejoredu.seguimiento.util.AdecuacionListConverter;
import mx.sep.dgtic.mejoredu.seguimiento.util.JasperReportManager;

@Service
public class SolicitudSeguimientoServiceImpl implements SolicitudSeguimientoService {

	private static final Object SOLICITUD_RECHAZADA = 2239;
	@Inject
	private AnhoPlaneacionRespository anhoPlaneacionRepository;
	@Inject
	private SolicitudRepository solicitudRepository;
	@Inject
	private UsuarioRepository usuarioRepository;
	@Inject
	private PerfilLaboralRepository perfilLaboralRepository;
	@Inject
	private MasterCatalogoRepository masterCatalogoRepository;
	@Inject
	private AdecuacionService adecuacionService;
	@Inject
	private SecuenciaFolioSolicitudRepo secuenciaFolioSolicitudRepo;
	@Inject
	private SecuenciaFolioSolicitudAnhioRepo secuenciaFolioSolicitudAnhioRepo;
	
	@Inject
	private HistoricoSolicitudRepository historicoSolicitudRepository;
	@Inject
	private JasperReportManager reportManager;
	@RestClient
	private AlfrescoRestClient alfrescoRest;
	@ConfigProperty(name = "sipse.alf.uuid")
	private String UUID;

	@Inject
	SeguimientoAdecuaRegistroRepository seguimientoAdecuaRegistroRepository;
	
	@Inject
	ProyectoAnualRepository proyectoAnualRepository;
	
	@Inject
	AdecuacionRepository adecuacionRepository;
	
	@Inject
	AdecuacionProyectoRepository adecuacionProyectoRepository;

	Integer CERO = 0;

	private static void addIfNotNull(List<Parameters> parameters, String key, String param, Object value) {
		if (value instanceof List<?> && ((List<?>) value).isEmpty()) {
			return;
		}
		if (value != null) {
			parameters.add(new Parameters(key, param, value));
		}
	}

	@Override
	@Transactional
	public SolicitudDTO.IdSolicitud registrar(SolicitudDTO solicitud) {
		Solicitud nuevaSolicitud = convert(solicitud);
		nuevaSolicitud.setFechaSolicitud(LocalDate.now());
		nuevaSolicitud.setDhSolicitud(LocalTime.now());
		// nuevaSolicitud.setCxUUID("92596fb9-0364-4459-be93-22159e331d47");
		// Se agrega el uuid generico para el acta de
		// solicitud, en su momento se generará el
		// pdf por Jasper
		solicitudRepository.persistAndFlush(nuevaSolicitud);
		solicitud.setIdSolicitud(nuevaSolicitud.getIdSolicitud());
		adecuacionService.registrar(nuevaSolicitud.getIdSolicitud(), solicitud.getAdecuaciones());

		return SolicitudDTO.IdSolicitud.builder().idSolicitud(solicitud.getIdSolicitud()).build();
	}

	@Override
	@Transactional
	public void actualizaPorId(Integer idSolicitud, SolicitudDTO solicitudUpdate) {
		var solicitud = findById(idSolicitud);
		Solicitud update = convert(solicitudUpdate);

		solicitud.setFolioSolicitud(update.getFolioSolicitud());
		solicitud.setFolioSIF(update.getFolioSIF());
		solicitud.setFechaSolicitud(LocalDate.now());
		solicitud.setDhSolicitud(LocalTime.now());
		solicitud.setFechaAutorizacion(update.getFechaAutorizacion());
		solicitud.setMontoAplicacion(update.getMontoAplicacion());
		solicitud.setJustificacion(update.getJustificacion());
		solicitud.setObjetivo(update.getObjetivo());

		solicitud.setDireccionCatalogo(update.getDireccionCatalogo());
		solicitud.setUnidadCatalogo(update.getUnidadCatalogo());
		solicitud.setAnhioCatalogo(update.getAnhioCatalogo());
		solicitud.setAdecuacionCatalogo(update.getAdecuacionCatalogo());
		solicitud.setModificacionCatalogo(update.getModificacionCatalogo());
		solicitud.setEstatusCatalogo(update.getEstatusCatalogo());

		solicitud.setUsuario(update.getUsuario());

		adecuacionService.eliminarPorIdSolicitud(idSolicitud);
		adecuacionService.registrar(solicitud.getIdSolicitud(), solicitudUpdate.getAdecuaciones());
		solicitudRepository.persistAndFlush(solicitud);
	}

	@Override
	public SolicitudDTO consultaPorId(int idSolicitud) {
		var solicitudDTO = convert(findById(idSolicitud));
		solicitudDTO.setAdecuaciones(adecuacionService.consultaPorIdSolicitud(idSolicitud));
		solicitudDTO.setHistoricoSolicitud(this.consultarHistoricoPorId(idSolicitud));
		// Validar si existe info en los apartados
		Long noInfoEnBase = seguimientoAdecuaRegistroRepository.count("idSolicitud", idSolicitud);

		solicitudDTO.setIbExisteInfo(noInfoEnBase > 0 ? noInfoEnBase.intValue() : CERO);
		return solicitudDTO;
	}

	private List<HistoricoSolicitud> consultarHistoricoPorId(int idSolicitud) {
		List<HistoricoSolicitud> hSolicitudDTO = convert(
				historicoSolicitudRepository.find("solicitud.idSolicitud", idSolicitud));
		return hSolicitudDTO;

	}

	private List<HistoricoSolicitud> convert(PanacheQuery<MehSolicitud> historicoSolicitud) {
		List<HistoricoSolicitud> respuesta = new ArrayList<>();
		historicoSolicitud.stream().map(historico -> {
			HistoricoSolicitud historicoDto = new HistoricoSolicitud();
			historicoDto.setIdHistorico(historico.getIdHistoricoSolicitud());
			historicoDto.setIdSolicitud(historico.getSolicitud().getIdSolicitud());
			historicoDto.setIdEstatus(historico.getCatalogoEstatus().getId());
			historicoDto.setDfSolicitud(historico.getDfSolicitud());
			historicoDto.setDhSolicitud(historico.getDhSolicitud());
			historicoDto.setUsuario(historico.getUsuario().getCveUsuario());

			return historicoDto;

		}).forEach(respuesta::add);
		return respuesta;
	}

	private Solicitud findById(int idSolicitud) {
		var solicitud = solicitudRepository.findById(idSolicitud);
		if (solicitud == null) {
			throw new NotFoundException("No existe la solicitud con id " + idSolicitud);
		}
		return solicitud;
	}

	@Override
	public List<SolicitudDTO> consultaSolicitudes(String usuario, PeticionSolicitudDTO solicitud) {
		if (solicitud == null) {
			throw new NotFoundException("No existen solicitudes con los parametros de busqueda");
		}
		var perfilUser = perfilLaboralRepository.findByCveUsuario(usuario).orElseThrow(
				() -> new IllegalArgumentException("No se encontro el perfil laboral del Usuario: " + usuario));

		TipoUsuarioEnum tipoUser = Arrays.stream(TipoUsuarioEnum.values())
				.filter(e -> e.getIdTipoUsuario() == perfilUser.getUsuario().getTipoUsuario().getIdTipoUsuario())
				.findAny().orElseThrow(() -> new IllegalArgumentException(
						"Tipo Usuario no reconocido: " + perfilUser.getUsuario().getTipoUsuario().getIdTipoUsuario()));

		List<Parameters> parameters = new ArrayList<>();
		List<Solicitud> solicitudesRechazadas = new ArrayList<>();
		switch (tipoUser) {
		case ENLACE:
			addIfNotNull(parameters, "s.usuario.cveUsuario", "usuario", usuario);
			addIfNotNull(parameters, "s.unidadCatalogo.id", "unidadCatalogo", solicitud.getIdCatalogoUnidad());

			// Buscar por solicitudes rechazadas de la unidad
			/*solicitudesRechazadas = solicitudRepository.find("estatusCatalogo.id = ?1 and unidadCatalogo.id = ?2",
					SOLICITUD_RECHAZADA, perfilUser.getCatalogoUnidad().getId()).list();*/
			break;
		case PRESUPUESTO:
		case PLANEACION:
			addIfNotNull(parameters, "s.unidadCatalogo.id", "unidadCatalogo", perfilUser.getCatalogoUnidad().getId());
			break;
		case SUPERVISOR:
			addIfNotNull(parameters, "s.unidadCatalogo.id", "unidadCatalogo", solicitud.getIdCatalogoUnidad());
			break;
		default:
			throw new IllegalArgumentException(
					"Tipo Usuario no reconocido: " + perfilUser.getUsuario().getTipoUsuario().getIdTipoUsuario());
		}
		addIfNotNull(parameters, "s.anhioCatalogo.id", "anhioCatalogo", solicitud.getIdCatalogoAnhio());
		addIfNotNull(parameters, "s.adecuacionCatalogo.id", "adecuacionCatalogo", solicitud.getIdCatalogoAdecuacion());
		// Aquí está la clave
		addIfNotNull(parameters, "s.modificacionCatalogo.id", "modificacionCatalogo",
				solicitud.getIdCatalogoModificacion());
		addIfNotNull(parameters, "s.estatusCatalogo.id", "estatusCatalogo", solicitud.getIdCatalogoEstatus());
		addIfNotNull(parameters, "s.fechaSolicitud", "fechaSolicitud", solicitud.getFechaSolicitud());
		addIfNotNull(parameters, "s.fechaAutorizacion", "fechaAutorizacion", solicitud.getFechaAutorizacion());

		if (parameters.isEmpty()) {
			throw new NotFoundException("No existen solicitudes con los parametros de busqueda");
		}

		var query = parameters.stream().map(entry -> {
			if (entry.getValue() instanceof List) {
				return entry.getKey() + " in (:" + entry.getParam() + ")";
			}
			return entry.getKey() + " = :" + entry.getParam();
		}).collect(Collectors.joining(" and "));

		Log.debug(query);

		var values = parameters.stream().collect(Collectors.toMap(Parameters::getParam, Parameters::getValue));

		Log.debug(values);

		var solicitudes = solicitudRepository.findSolicitudes(query, values);
    solicitudes.addAll(solicitudesRechazadas);

		if (solicitudes.isEmpty()) {
			throw new NotFoundException("No existen solicitudes con los parametros de busqueda");
		}
		return convertList(solicitudes);
	}

	@Override
	@Transactional
	public void eliminar(int idSolicitud) {
		if (solicitudRepository.findById(idSolicitud) == null) {
			throw new NotFoundException("No existe la solicitud con id: " + idSolicitud);
		}
		adecuacionService.eliminarPorIdSolicitud(idSolicitud);
		solicitudRepository.deleteById(idSolicitud);
	}

	private List<SolicitudDTO> convertList(List<Solicitud> solicitudes) {
		return solicitudes.stream().map(solicitud -> mapperDTO().map(solicitud, SolicitudDTO.class))
				.collect(Collectors.toList());
	}

	private SolicitudDTO convert(Solicitud solicitud) {
		return mapperDTO().map(solicitud, SolicitudDTO.class);
	}

	private ModelMapper mapperDTO() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.typeMap(Solicitud.class, SolicitudDTO.class).addMappings(mapper -> {

			mapper.map(Solicitud::hasChangedIndicators, SolicitudDTO::setCambiaIndicadores);
			mapper.map(src -> src.getDireccionCatalogo().getId(), SolicitudDTO::setDireccionId);
			mapper.map(src -> src.getUnidadCatalogo().getId(), SolicitudDTO::setUnidadId);
			mapper.map(src -> src.getUnidadCatalogo().getCdOpcion(), SolicitudDTO::setUnidad);
			mapper.map(src -> src.getAnhioCatalogo().getIdAnhio(), SolicitudDTO::setAnhioId);
			mapper.map(src -> src.getAnhioCatalogo().getIdAnhio(), SolicitudDTO::setAnhio);
			mapper.map(src -> src.getAdecuacionCatalogo().getId(), SolicitudDTO::setAdecuacionId);
			mapper.map(src -> src.getAdecuacionCatalogo().getCdOpcion(), SolicitudDTO::setTipoAdecuacion);
			mapper.map(src -> src.getModificacionCatalogo().getId(), SolicitudDTO::setModificacionId);
			mapper.map(src -> src.getModificacionCatalogo().getCdOpcion(), SolicitudDTO::setTipoModificacion);
			mapper.map(src -> src.getEstatusCatalogo().getId(), SolicitudDTO::setEstatusId);
			mapper.map(src -> src.getEstatusCatalogo().getCdOpcion(), SolicitudDTO::setEstatus);
			mapper.map(src -> src.getEstatusPlaneacionCatalogo().getId(), SolicitudDTO::setEstatusIdPlaneacion);
			mapper.map(src -> src.getEstatusPlaneacionCatalogo().getCdOpcion(), SolicitudDTO::setEstatusPlaneacion);
			mapper.map(src -> src.getUsuario().getCveUsuario(), SolicitudDTO::setUsuario);
			mapper.map(src -> src.getCxUUID(), SolicitudDTO::setCxUUID);

			mapper.using(new AdecuacionListConverter()).map(Solicitud::getAdecuaciones, SolicitudDTO::setAdecuaciones);
		});
		return modelMapper;
	}

	private Solicitud convert(SolicitudDTO solicitudVo) {
		ModelMapper modelMapper = new ModelMapper();
		Solicitud solicitud = modelMapper.map(solicitudVo, Solicitud.class);

		solicitud.setAnhioCatalogo(anhoPlaneacionRepository.findById(solicitudVo.getAnhioId()));
		solicitud.setUnidadCatalogo(masterCatalogoRepository.findById(solicitudVo.getUnidadId()));
		solicitud.setDireccionCatalogo(masterCatalogoRepository.findById(solicitudVo.getDireccionId()));
		solicitud.setAdecuacionCatalogo(masterCatalogoRepository.findById(solicitudVo.getAdecuacionId()));
		solicitud.setModificacionCatalogo(masterCatalogoRepository.findById(solicitudVo.getModificacionId()));
		solicitud.setEstatusCatalogo(masterCatalogoRepository.findById(solicitudVo.getEstatusId()));
		solicitud.setUsuario(usuarioRepository.findById(solicitudVo.getUsuario()));

		return solicitud;
	}

	@Override
	public MensajePersonalizado<Integer> secuencialFolio(Integer idUnidad) {

		MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		// -Recuperar secuencia de la unidad
		var secuenciaPorUnidad = secuenciaFolioSolicitudRepo.find("catalogoUnidad.id", idUnidad).firstResult();

		Integer secAdmiva = 0;
		if (secuenciaPorUnidad == null || secuenciaPorUnidad.getCatalogoUnidad() == null
				|| secuenciaPorUnidad.getSecuencia() == null) {
			secAdmiva = 1;
			secuenciaPorUnidad = new SecuenciaFolioSolicitud();
		} else {
			// secAdmiva = secuenciaPorUnidad.getIxSecuencia() + 1;
			secAdmiva = secuenciaPorUnidad.getSecuencia();
		}
		secuenciaPorUnidad.setSecuencia(secAdmiva);

		try {
			respuesta.setRespuesta(secAdmiva);
			// secuenciaFolioSolicitudRepo.persistAndFlush(secuenciaPorUnidad);
		} catch (Exception e) {
			respuesta.setCodigo("500");
			respuesta.setMensaje("Error al calcular y pesistir la secuencia por unidad admiva");
			Log.error("Error al calcular y pesistir la secuencia por unidad admiva", e);
		}
		return respuesta;
	}

	@Override
	public MensajePersonalizado<Integer> secuencialFolioAnhio(Integer idAnhio) {

		MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		// -Recuperar secuencia de la unidad
		var secuenciaPorAnhio = secuenciaFolioSolicitudAnhioRepo.find("idAnhio", idAnhio).firstResult();

		Integer secAdmiva = 0;
		if (secuenciaPorAnhio == null || secuenciaPorAnhio.getIdAnhio() == null
				|| secuenciaPorAnhio.getSecuencia() == null) {
			secAdmiva = 1;
			secuenciaPorAnhio = new SecuenciaFolioAnhio();
		} else {
			// secAdmiva = secuenciaPorUnidad.getIxSecuencia() + 1;
			secAdmiva = secuenciaPorAnhio.getSecuencia();
		}
		secuenciaPorAnhio.setSecuencia(secAdmiva);

		try {
			respuesta.setRespuesta(secAdmiva);
			// secuenciaFolioSolicitudRepo.persistAndFlush(secuenciaPorUnidad);
		} catch (Exception e) {
			respuesta.setCodigo("500");
			respuesta.setMensaje("Error al calcular y pesistir la secuencia por año");
			Log.error("Error al calcular y pesistir la secuencia por año", e);
		}
		return respuesta;
	}
	
	@Transactional
	public RespuestaGenerica cambiarEstatus(Integer idEstatus, Integer idSolicitud, String cveUsuario) {
		if (idSolicitud == null) {
			throw new NotFoundException("No existe la solicitud con id " + idSolicitud);
		}
		Solicitud solicitud = solicitudRepository.findById(idSolicitud);
		if (solicitud == null) {
			throw new NotFoundException("No existe la solicitud con id " + idSolicitud);
		}
		Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null) {
			throw new NotFoundException("No existe el usuario con clave : " + cveUsuario);
		}
		if (usuario.getTipoUsuario().getIdTipoUsuario() != TipoUsuarioEnum.SUPERVISOR.getIdTipoUsuario()
				&& usuario.getTipoUsuario().getIdTipoUsuario() != TipoUsuarioEnum.PRESUPUESTO.getIdTipoUsuario()
				&& usuario.getTipoUsuario().getIdTipoUsuario() != TipoUsuarioEnum.CONSULTOR.getIdTipoUsuario()
				&& usuario.getTipoUsuario().getIdTipoUsuario() != TipoUsuarioEnum.PLANEACION.getIdTipoUsuario()
				&& usuario.getTipoUsuario().getIdTipoUsuario() != TipoUsuarioEnum.ENLACE.getIdTipoUsuario()) {
			throw new NotFoundException(
					"El usuario no tiene los permisos de cambio, favor de validar privilegios al usuario con clave : "
							+ cveUsuario);
		}
		MasterCatalogo estatus = masterCatalogoRepository.findById(idEstatus);
		if (estatus == null) {
			throw new NotFoundException("No existe el estatus con id " + idEstatus);
		}

		solicitud.setFechaAutorizacion(LocalDate.now());

		/**/
		List<Integer> iStatusSincronia = new ArrayList<Integer>();
		iStatusSincronia.add(2238);// En revisión
		iStatusSincronia.add(2239);// Rechazado
		iStatusSincronia.add(92672);// Por revisar

		// Validar tipo de usuario para ajustar estatus de la solicitud
		switch (solicitud.getAdecuacionCatalogo().getId()) {

		case 2223: // Si es tipo de adecuación programatica
			solicitud.setEstatusCatalogo(estatus);
			if ("PLANEACION".equals(usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()))
				solicitud.setEstatusPlaneacionCatalogo(estatus);
			break;
		case 2224:// Si es tipo de adecuación presupuestal
			switch (usuario.getTipoUsuario().getCdTipoUsuario().toUpperCase()) {
			case "PLANEACION":
				solicitud.setEstatusPlaneacionCatalogo(estatus);
				break;
			case "ENLACE":
			case "SUPERVISOR":
				if (iStatusSincronia.indexOf(idEstatus) >= CERO)
					solicitud.setEstatusPlaneacionCatalogo(estatus);
				solicitud.setEstatusCatalogo(estatus);
				break;
			default:
				//solicitud.setEstatusPlaneacionCatalogo(null);
				solicitud.setEstatusCatalogo(estatus);
				break;
			}
			break;
		case 2225:// Si es tipo de adecuación programatica presupuestal
			solicitud.setEstatusCatalogo(estatus);
			break;

		}
		
		 
		/*
		 * En caso de ser cambio de estatus APROBACION c/s MIR
		 * Pasar el proyecto a estatus igual a APROBADO = "O"
		 */
		switch (solicitud.getEstatusCatalogo().getId()) {

		case 2240:
		case 2243:
			
			
			AdecuacionSolicitud adecuacion = adecuacionRepository.find("solicitud.idSolicitud = ?1 and catalogoModificacion.id = ?2 and catalogoApartado.id= ?3", idSolicitud,2209,2217).firstResult();
			AdecuacionProyecto adecuacionProyecto = adecuacionProyectoRepository.find("idAdecuacionSolicitud", adecuacion.getIdAdecuacionSolicitud()).firstResult();
			Proyecto proyectoAprobado = proyectoAnualRepository.findById(adecuacionProyecto.getIdProyectoModificacion());
			proyectoAprobado.setCsEstatus("O");
			proyectoAnualRepository.persistAndFlush(proyectoAprobado);
			break;
		}
		

		// Agregar firmado de la solicitud - Tomar archivoFirma asociado al usuario que
		// entra por parametro
		// set archivoFirma

		/* Definir valor de estatus segun Rol y estatus */
		// Si es usuario enlace y está mandando a revisión cambiará ambos estatus

		List<MehSolicitud> lstHSolicitud = solicitud.getHSolicitud();
		MehSolicitud hSolicitud = new MehSolicitud();
		hSolicitud.setCatalogoEstatus(estatus);
		hSolicitud.setSolicitud(solicitud);
		hSolicitud.setUsuario(usuario);
		hSolicitud.setDfSolicitud(LocalDate.now());
		hSolicitud.setDhSolicitud(LocalTime.now());
		lstHSolicitud.add(hSolicitud);
		// Agregar persistencia de historico del cambio de estatus en la solicitud
		solicitud.setHSolicitud(lstHSolicitud);

		Log.info("idSolicitud: " + solicitud.getIdSolicitud());
		Log.info("idStatus: " + solicitud.getEstatusCatalogo().getId());
		solicitudRepository.persistAndFlush(solicitud);
		Log.info("idSolicitudH: " + hSolicitud.getSolicitud().getIdSolicitud());
		Log.info("idStatusH: " + hSolicitud.getSolicitud().getEstatusCatalogo().getId());
		historicoSolicitudRepository.persistAndFlush(hSolicitud);

		try {
			JasperReportResponse responseFile = reportManager.getItemReport("adecuacion_programatica", solicitud);
			if (responseFile == null) {
				Log.error("Error al generar el formato: No se encontró información");
				return new RespuestaGenerica("500",
						"Error al generar el formato de la solicitud: No se encontró información");
			}

			MultipartBody multi = new MultipartBody();
			multi.name = responseFile.getNombreArchivo();
			multi.filedata = new ByteArrayInputStream(responseFile.getStreamByte());
			multi.overwrite = true;

			Response responseSave = alfrescoRest.createFile(UUID, multi);
			ResponseCreateFile nodeCreate = responseSave.readEntity(ResponseCreateFile.class);
			String uuidPDF = nodeCreate.getEntry().getId();

			solicitud.setCxUUID(uuidPDF);
			Log.info("idSolicitud: " + solicitud.getIdSolicitud());
			Log.info("idStatus: " + solicitud.getEstatusCatalogo().getId());
			solicitudRepository.persistAndFlush(solicitud);
			return new RespuestaGenerica("200", uuidPDF);
		} catch (Exception e) {
			e.printStackTrace();
			Log.error("Error al depositar el archivo en Alfresco: ", e);
			return new RespuestaGenerica("500", "Error al depositar el archivo en Alfresco: " + e.getMessage());
		}
	}

	@Override
	public JasperReportResponse obtenerReporte(Integer idSolicitud) {
		var solicitud = findById(idSolicitud);
		JasperReportResponse responseFile = reportManager.getItemReport("adecuacion_programatica", solicitud);

		MultipartBody multi = new MultipartBody();
		multi.name = responseFile.getNombreArchivo();
		multi.filedata = new ByteArrayInputStream(responseFile.getStreamByte());
		multi.overwrite = true;

		Response responseSave = alfrescoRest.createFile(UUID, multi);
		ResponseCreateFile nodeCreate = responseSave.readEntity(ResponseCreateFile.class);
		String uuidPDF = nodeCreate.getEntry().getId();
		Log.info("### uuidPDF: " + uuidPDF);

		return responseFile;
	}

	@Data
	public static class Parameters {
		String key = null;
		String param = null;
		Object value = null;

		Parameters(String key, String param, Object value) {
			this.key = key;
			this.param = param;
			this.value = value;
		}
	}

}