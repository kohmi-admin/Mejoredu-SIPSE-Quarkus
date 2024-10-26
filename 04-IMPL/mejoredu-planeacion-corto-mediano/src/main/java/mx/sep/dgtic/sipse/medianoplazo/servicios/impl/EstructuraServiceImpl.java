package mx.sep.dgtic.sipse.medianoplazo.servicios.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.cfg.MapperBuilder;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.AnhoPlaneacion;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.InicioDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionInicioDTO;
import mx.sep.dgtic.sipse.medianoplazo.daos.AnhioPlaneacionRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.EstructuraRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.MasterCatalogoRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.MetValidacionRepository;
import mx.sep.dgtic.sipse.medianoplazo.daos.UsuarioRepository;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Estructura;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MasterCatalogo;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MetValidacionEntity;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Usuario;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IEstructuraService;

@Service
public class EstructuraServiceImpl implements IEstructuraService {

	@Inject
	private EstructuraRepository estructuraRepository;

	@Inject
	private MasterCatalogoRepository catalogosRepository;

	@Inject
	private UsuarioRepository usuarioRepository;

	@Inject
	private AnhioPlaneacionRepository anhioPlaneacionRepository;

	@Inject
	private MetValidacionRepository validacionRepository;

	@Inject
	AnhioPlaneacionRepository anhioPlanRepository;

	@Override
	@Transactional
	public RespuestaGenerica registrar(PeticionInicioDTO peticion) {

		MasterCatalogo catAlineacion = catalogosRepository.findById(peticion.getAlineacion());
		if (catAlineacion == null)
			return new RespuestaGenerica("500", "El ID de Alineación no existe, validar.");

		Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");
		AnhoPlaneacion anhioPlaneacion = anhioPlaneacionRepository.findById(peticion.getAnhioPlaneacion());
		if (anhioPlaneacion == null)
			return new RespuestaGenerica("500", "El año de planeación no existe, validar.");

		Estructura estructura = new Estructura();
		estructura.setCdNombrePrograma(peticion.getNombre());
		estructura.setCdAnalisisEstado(peticion.getAnalisis());
		estructura.setCdProblemasPublicos(peticion.getProblemas());
		estructura.setAlineacion(catAlineacion);
		estructura.setUsuario(usuario);
		estructura.setDfRegistro(LocalDate.now());
		estructura.setDhRegistro(LocalTime.now());
		estructura.setCsEstatus(peticion.getEstatus());

		estructura.setAnhoPlaneacion(anhioPlaneacion);

		estructuraRepository.persistAndFlush(estructura);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica modificar(PeticionInicioDTO peticion, Integer idEstructura) {
		Estructura estructura = estructuraRepository.findById(idEstructura);
		if (estructura == null)
			return new RespuestaGenerica("500", "El ID de la estructura no existe, validar.");

		MasterCatalogo catAlineacion = catalogosRepository.findById(peticion.getAlineacion());
		if (catAlineacion == null)
			return new RespuestaGenerica("500", "El ID de Alineación no existe, validar.");

		Usuario usuario = usuarioRepository.findById(peticion.getUsuario());
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");

		estructura.setCdNombrePrograma(peticion.getNombre());
		estructura.setCdAnalisisEstado(peticion.getAnalisis());
		estructura.setCdProblemasPublicos(peticion.getProblemas());

		estructura.setAlineacion(catAlineacion);
		estructura.setUsuario(usuario);

		estructura.setCsEstatus(peticion.getEstatus());
		estructura.setDfRegistro(LocalDate.now());
		estructura.setDhRegistro(LocalTime.now());
		estructuraRepository.persistAndFlush(estructura);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica eliminar(Integer idEstructura, String cveUsuario) {
		Estructura estructura = estructuraRepository.findById(idEstructura);
		if (estructura == null)
			return new RespuestaGenerica("500", "El ID de la estructura no existe, validar.");

		Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");

		estructura.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
		estructura.setDfRegistro(LocalDate.now());
		estructura.setDhRegistro(LocalTime.now());

		estructura.setUsuario(usuario);
		estructuraRepository.persistAndFlush(estructura);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica finalizarRegistro(Integer idEstructura, String cveUsuario) {
		Estructura estructura = estructuraRepository.findById(idEstructura);
		if (estructura == null)
			return new RespuestaGenerica("500", "El ID de la estructura no existe, validar.");

		Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");

		estructura.setCsEstatus(EstatusEnum.FINALIZADO.getEstatus());
		estructura.setDfRegistro(LocalDate.now());
		estructura.setDhRegistro(LocalTime.now());

		estructura.setUsuario(usuario);
		estructuraRepository.persistAndFlush(estructura);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica enviarRevision(Integer idEstructura, String cveUsuario) {
		Estructura estructura = estructuraRepository.findById(idEstructura);
		if (estructura == null)
			return new RespuestaGenerica("500", "El ID de la estructura no existe, validar.");

		Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");

		estructura.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());
		estructura.setDfRegistro(LocalDate.now());
		estructura.setDhRegistro(LocalTime.now());

		estructura.setUsuario(usuario);
		estructuraRepository.persistAndFlush(estructura);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica enviarValidacionTecnica(Integer idEstructura, String cveUsuario) {
		Estructura estructura = estructuraRepository.findById(idEstructura);
		if (estructura == null)
			return new RespuestaGenerica("500", "El ID de la estructura no existe, validar.");

		Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");

		estructura.setCsEstatus(EstatusEnum.VALIDACIONTECNICA.getEstatus());
		estructura.setDfRegistro(LocalDate.now());
		estructura.setDhRegistro(LocalTime.now());

		estructura.setUsuario(usuario);
		estructuraRepository.persistAndFlush(estructura);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica registroAprobado(Integer idEstructura, String cveUsuario) {
		Estructura estructura = estructuraRepository.findById(idEstructura);
		if (estructura == null)
			return new RespuestaGenerica("500", "El ID de la estructura no existe, validar.");

		Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");

		estructura.setCsEstatus(EstatusEnum.APROBADO.getEstatus());
		estructura.setDfRegistro(LocalDate.now());
		estructura.setDhRegistro(LocalTime.now());

		estructura.setUsuario(usuario);
		estructuraRepository.persistAndFlush(estructura);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	public MensajePersonalizado<List<InicioDTO>> consultarEstructuraActivos() {

		List<InicioDTO> lstInicio = new ArrayList<>();
		MensajePersonalizado<List<InicioDTO>> respuesta = new MensajePersonalizado<List<InicioDTO>>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");

		List<Estructura> lstEstructura = estructuraRepository.find("csEstatus!='B'").list();
		lstEstructura.stream().map(inicio -> {
			InicioDTO inicioDto = new InicioDTO();
			inicioDto.setIdPrograma(inicio.getIdEstructura());
			inicioDto.setNombrePrograma(inicio.getCdNombrePrograma());
			inicioDto.setAnalisis(inicio.getCdAnalisisEstado());
			inicioDto.setAlineacionPND(inicio.getAlineacion().getIdCatalogo());
			inicioDto.setProgramasPublicos(inicio.getCdProblemasPublicos());
			inicioDto.setEstatus(inicio.getCsEstatus());
			// Validar estauts de planeación
			String estatusPlaneacion = "P"; // pendiente por validar
			if (inicio.getIdValidacionPlaneacion() != null) {
				MetValidacionEntity validacionPlan = validacionRepository.findById(inicio.getIdValidacionPlaneacion());
				estatusPlaneacion = validacionPlan.getCsEstatus();
			}
			inicioDto.setEstatusPlaneacion(estatusPlaneacion);
			// Validar estauts de Supervisor
			String estatusSupervisor = "P";
			if (inicio.getIdValidacionSupervisor() != null) {
				MetValidacionEntity validacionPlanSuper = validacionRepository
						.findById(inicio.getIdValidacionSupervisor());
				estatusSupervisor = validacionPlanSuper.getCsEstatus();
			}
			inicioDto.setEstatusSupervisor(estatusSupervisor);
			inicioDto.setAnhioPlaneacion(inicio.getAnhoPlaneacion().getIdAnhio());
			return inicioDto;
		}).forEach(lstInicio::add);

		respuesta.setRespuesta(lstInicio);
		return respuesta;
	}

	@Override
	public MensajePersonalizado<InicioDTO> consultarEstructuraPorID(Integer idEstructura) {

		MensajePersonalizado<InicioDTO> respuesta = new MensajePersonalizado<InicioDTO>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");

		List<Estructura> lstEstructura = estructuraRepository.find("idEstructura", idEstructura).list();
		lstEstructura.stream().map(inicio -> {
			InicioDTO inicioDto = new InicioDTO();
			inicioDto.setIdPrograma(inicio.getIdEstructura());
			inicioDto.setNombrePrograma(inicio.getCdNombrePrograma());
			inicioDto.setAnalisis(inicio.getCdAnalisisEstado());
			inicioDto.setAlineacionPND(inicio.getAlineacion().getIdCatalogo());
			inicioDto.setProgramasPublicos(inicio.getCdProblemasPublicos());
			inicioDto.setEstatus(inicio.getCsEstatus());
			// Validar estauts de planeación
			String estatusPlaneacion = "P"; // pendiente por validar
			if (inicio.getIdValidacionPlaneacion() != null) {
				MetValidacionEntity validacionPlan = validacionRepository.findById(inicio.getIdValidacionPlaneacion());
				estatusPlaneacion = validacionPlan.getCsEstatus();
			}
			inicioDto.setEstatusPlaneacion(estatusPlaneacion);
			// Validar estatus de Supervisor
			String estatusSupervisor = "P";
			if (inicio.getIdValidacionSupervisor() != null) {
				MetValidacionEntity validacionPlanSuper = validacionRepository
						.findById(inicio.getIdValidacionSupervisor());
				estatusSupervisor = validacionPlanSuper.getCsEstatus();
			}
			inicioDto.setEstatusSupervisor(estatusSupervisor);
			inicioDto.setAnhioPlaneacion(inicio.getAnhoPlaneacion().getIdAnhio());
			return inicioDto;
		}).forEach(respuesta::setRespuesta);

		return respuesta;
	}

	@Override
	public MensajePersonalizado<InicioDTO> consultarEstructuraPorAnhio(Integer anhio) {

		MensajePersonalizado<InicioDTO> respuesta = new MensajePersonalizado<InicioDTO>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");

		List<Estructura> lstEstructura = estructuraRepository
				.find("anhoPlaneacion.idAnhio = ?1 and csEstatus !='B'", anhio).list();
		lstEstructura.stream().map(inicio -> {
			InicioDTO inicioDto = new InicioDTO();
			inicioDto.setIdPrograma(inicio.getIdEstructura());
			inicioDto.setNombrePrograma(inicio.getCdNombrePrograma());
			inicioDto.setAnalisis(inicio.getCdAnalisisEstado());
			inicioDto.setAlineacionPND(inicio.getAlineacion().getIdCatalogo());
			inicioDto.setProgramasPublicos(inicio.getCdProblemasPublicos());

			inicioDto.setEstatus(inicio.getCsEstatus());
			// Validar estauts de planeación
			String estatusPlaneacion = "P"; // pendiente por validar
			if (inicio.getIdValidacionPlaneacion() != null) {
				MetValidacionEntity validacionPlan = validacionRepository.findById(inicio.getIdValidacionPlaneacion());
				estatusPlaneacion = validacionPlan.getCsEstatus();
			}
			inicioDto.setEstatusPlaneacion(estatusPlaneacion);
			// Validar estauts de Supervisor
			String estatusSupervisor = "P";
			if (inicio.getIdValidacionSupervisor() != null) {
				MetValidacionEntity validacionPlanSuper = validacionRepository
						.findById(inicio.getIdValidacionSupervisor());
				estatusSupervisor = validacionPlanSuper.getCsEstatus();
			}
			inicioDto.setEstatusSupervisor(estatusSupervisor);
			inicioDto.setAnhioPlaneacion(inicio.getAnhoPlaneacion().getIdAnhio());
			return inicioDto;
		}).forEach(respuesta::setRespuesta);

		if (respuesta.getRespuesta() == null) {
			if (LocalDate.now().getYear() + 1 == anhio) {
				respuesta = this.validarContenido(respuesta, anhio);
			} else {
				respuesta.setCodigo("407");
				respuesta.setMensaje("No existe información");
			}

		}
		return respuesta;
	}

	@Transactional
	public MensajePersonalizado<InicioDTO> validarContenido(MensajePersonalizado<InicioDTO> respuesta, Integer anhio) {

		Estructura inicio = estructuraRepository.find("anhoPlaneacion.idAnhio = ?1 and csEstatus !='B'", anhio - 1)
				.firstResult();
		if (inicio != null) { // LocalDate.now().getYear()
			Estructura inicioNuevo = new Estructura();
			respuesta.setRespuesta(null); // Inicializamos la respuesta

			InicioDTO inicioDto = new InicioDTO();
			AnhoPlaneacion anhioActual = anhioPlanRepository.findById(anhio);
			if (anhioActual == null) {
				respuesta.setCodigo("406");
				respuesta.setMensaje(
						"No existe año de planeación " + anhio + " favor de cargarlo en catálogo modulo configuración");
			} else {

				inicioDto.setAnhioPlaneacion(anhio);
				inicioDto.setFhRegistro(LocalDate.now());
				inicioDto.setIdPrograma(inicio.getIdEstructura());
				inicioDto.setNombrePrograma(inicio.getCdNombrePrograma());
				inicioDto.setAnalisis(inicio.getCdAnalisisEstado());
				inicioDto.setAlineacionPND(inicio.getAlineacion().getIdCatalogo());
				inicioDto.setProgramasPublicos(inicio.getCdProblemasPublicos());

				inicioDto.setEstatus(EstatusEnum.INACTIVO.getEstatus()); // Guardar como estatus Incompleto

				inicioNuevo.setIdEstructura(null);
				inicioNuevo.setCsEstatus(inicio.getCsEstatus());

				inicioNuevo.setAnhoPlaneacion(anhioActual);
				inicioNuevo.setDfRegistro(LocalDate.now());
				inicioNuevo.setDhRegistro(LocalTime.now());
				inicioNuevo.setAlineacion(inicio.getAlineacion());
				inicioNuevo.setCdAnalisisEstado(inicio.getCdAnalisisEstado());
				inicioNuevo.setCdNombrePrograma(inicio.getCdNombrePrograma());
				inicioNuevo.setCdProblemasPublicos(inicio.getCdProblemasPublicos());
				inicioNuevo.setUsuario(inicio.getUsuario());
				// inicioNuevo.setMeta(inicio.getMeta());
				estructuraRepository.persistAndFlush(inicioNuevo);
				inicioDto.setIdPrograma(inicioNuevo.getIdEstructura());

				respuesta.setRespuesta(inicioDto);
			}

		} else {
			respuesta.setCodigo("405");
			respuesta.setMensaje("No existe información que clonar para el año solicitado " + anhio);
		}

		return respuesta;
	}
}
