package mx.sep.dgtic.mejoredu.seguimiento.controller;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.RespuestaAdecuacionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.RespuestaRegistroProyectoVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProyectoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectos;
import mx.sep.dgtic.mejoredu.seguimiento.ActualizarProyectoAnual;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.PeticionCancelacionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.service.FormularioAnaliticoService;
import mx.sep.dgtic.mejoredu.seguimiento.service.ProyectoService;

@RestController
@RequestMapping("/api/seguimiento/proyecto")
public class ProyectoController {
	@Inject
	FormularioAnaliticoService formularioAnaliticoService;
	@Inject
	private ProyectoService proyectoService;

	@PutMapping("modificarProyectosPorID/{idProyectoAnual}")
	public RespuestaGenerica actualizarProyectoAnual(@PathVariable int idProyectoAnual,
			@RequestBody ActualizarProyectoAnual peticionProyecto) {
		Log.debug("Iniciando actualizarProyectoAnual");
		proyectoService.actualizarProyectoAnual(idProyectoAnual, peticionProyecto);
		var respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Terminando actualizarProyectoAnual");
		return respuesta;
	}

	@PutMapping("finalizarRegistro")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica finalizarRegistro(PeticionPorID peticion) {
		RespuestaGenerica respuesta = proyectoService.finalizarRegistro(peticion);
		return respuesta;
	}

	@PutMapping("enviarARevisar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica enviarARevisar(PeticionPorID peticion) {
		RespuestaGenerica respuesta = proyectoService.enviarRevision(peticion);
		return respuesta;
	}

	@PutMapping("enviarAValidacionTecnica")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica enviarAValidacionTecnica(PeticionPorID peticion) {
		RespuestaGenerica respuesta = proyectoService.enviarValidacionTecnica(peticion);
		return respuesta;
	}

	@PutMapping("registroAprobado")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registroAprobado(PeticionPorID peticion) {
		return proyectoService.registroAprobado(peticion);
	}

	@GetMapping("consultarProyectos")
	public MensajePersonalizado<List<ProyectoVO>> consultaProyectos(@RequestParam("anhio") int anhio,
			@RequestParam(value = "idSolicitud", required = false, defaultValue = "0") Integer idSolicitud,
			@RequestParam(value = "excluirCortoPlazo", required = false, defaultValue = "false") boolean excluirCortoPlazo,
			@RequestParam(value = "priorizarProyectoAsociado", required = false, defaultValue = "false") boolean priorizarProyectoAsociado) {
		Log.debug("Iniciando consultaProyectos");

		var estatus = List.of("C", "I", "O");

		var proyectos = proyectoService.consultaProyectos(anhio, estatus, excluirCortoPlazo, idSolicitud, priorizarProyectoAsociado);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectos);

		Log.debug("Termina consultaProyectos");
		return respuesta;
	}

	@GetMapping("consultaProyectosPorAnhio/{idAnhio}/{itSemantica}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ProyectoVO>> consultaProyectosPorAnhio(@PathVariable int idAnhio,
			@PathVariable int itSemantica) {
		Log.debug("Iniciando consultaProyectosPorAnhio");
		Log.debug("consultaProyectosPorAnhio por : " + idAnhio);

		var proyectos = proyectoService.consultaProyectos(idAnhio, itSemantica);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectos);

		Log.debug("Termina consultaProyectosPorAnhio");
		return respuesta;
	}

	@GetMapping("consultaProyectosPorAnhioParaValidar/{idAnhio}/{itSemantica}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaProyectos consultaProyectosPorAnhioParaValidar(@PathVariable int idAnhio,
			@PathVariable int itSemantica) {
		Log.debug("Iniciando consultaProyectosPorAnhioParaValidar");
		Log.debug("consultaProyectosParaValidar por : " + idAnhio);
		RespuestaProyectos respuesta = proyectoService.consultaProyectosParaValidar(idAnhio, itSemantica);

		Log.debug("Termina consultaProyectosParaValidar");
		return respuesta;
	}

	@GetMapping("consultaProyectosPorAnhioCarga/{idAnhio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaProyectos consultaProyectosPorAnhioCarga(@PathVariable int idAnhio) {
		Log.debug("Iniciando consultaProyectosPorAnhioCarga");
		Log.debug("consultaProyectosPorAnhioCarga por : " + idAnhio);
		RespuestaProyectos respuesta = proyectoService.consultaProyectosCarga(idAnhio, 0);

		Log.debug("Termina consultaProyectosPorAnhioCarga");
		return respuesta;
	}

	@GetMapping("consultarProyectoPorID/{idProyecto}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<ProyectoVO> consultarProyectoPorID(@PathVariable int idProyecto) {
		Log.debug("Iniciando consultarProyectoPorID ");
		Log.debug("consultaProyectosPorAnhio por : " + idProyecto);

		var proyectoVO = proyectoService.consultaProyectoPorId(idProyecto);
		var respuesta = new MensajePersonalizado<ProyectoVO>("200", "Exitoso", proyectoVO);

		Log.debug("Termina consultarProyectoPorID ");
		return respuesta;
	}

	@PostMapping("registrarProyecto")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<RespuestaRegistroProyectoVO> registrarProyecto(PeticionProyectoVO peticion) {
		Log.debug("Inicia registrarProyecto");

		var respuestaRegistro = proyectoService.registrarProyectoAnual(peticion);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", respuestaRegistro);

		Log.debug("Termina registrarProyecto");
		return respuesta;
	}

	@PutMapping("eliminarProyectosPorID")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminarProyectosPorID(PeticionPorID peticion) {
		Log.debug("Iniciando eliminar ");
		Log.debug("eliminar por : " + peticion.getId());
		Log.debug("Usuario : " + peticion.getId());

		proyectoService.eliminarProyectoAnual(peticion);
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");

		return respuesta;
	}

	@PutMapping("eliminarAdecuacion")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminarAdecuacionProyecto(PeticionEliminarModificacion peticion) {
		Log.debug("Iniciando eliminarAdecuacionProyecto ");
		Log.debug("eliminarAdecuacionProyecto por : " + peticion.getIdReferencia());

		proyectoService.eliminarAdecuacionProyectoAnual(peticion);
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");

		return respuesta;
	}

	@GetMapping("consultarProyectoModificacion/{idAdecuacionSolictud}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<RespuestaAdecuacionProyectoVO>> consultarProyectoModificacion(@PathVariable int idAdecuacionSolictud) {
		Log.debug("Iniciando consultarProyectoModificacion ");
		Log.debug("consultaProyectoModificacion por : " + idAdecuacionSolictud);

		var proyectoVO = proyectoService.consultaProyectoModificacion(idAdecuacionSolictud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectoVO);

		Log.debug("Termina consultarProyectoModificacion ");
		return respuesta;
	}

	@GetMapping("consultarProyectoModificacion/{idAdecuacionSolictud}/{idProyectoReferencia}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<RespuestaAdecuacionProyectoVO> consultarProyectoModificacion(@PathVariable int idAdecuacionSolictud,
			@PathVariable int idProyectoReferencia) {
		Log.debug("Iniciando consultarProyectoModificacion ");
		Log.debug("consultaProyectoModificacion por : " + idAdecuacionSolictud);

		var proyectoVO = proyectoService.consultaProyectoModificacion(idAdecuacionSolictud, idProyectoReferencia);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectoVO);

		Log.debug("Termina consultarProyectoModificacion ");
		return respuesta;
	}

	@GetMapping("consultarProyectoCancelacion/{idAdecuacionSolictud}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<RespuestaAdecuacionProyectoVO>> consultarProyectoCancelacion(@PathVariable int idAdecuacionSolictud) {
		Log.debug("Iniciando consultarProyectoCancelacion ");
		Log.debug("consultarProyectoCancelacion por : " + idAdecuacionSolictud);

		var proyectoVO = proyectoService.consultaProyectoCancelacion(idAdecuacionSolictud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", proyectoVO);

		Log.debug("Termina consultarProyectoCancelacion ");
		return respuesta;
	}

	@PutMapping("cancelarProyecto")
	public RespuestaGenerica cancelarProyecto(@RequestBody PeticionCancelacionProyectoVO peticion) {
		Log.debug("Iniciando cancelarProyecto");
		proyectoService.cancelarProyecto(peticion);
		var respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Terminando cancelarProyecto");
		return respuesta;
	}

	@GetMapping("consulta-proyectos-aprobados/{idAnhio}/{trimestre}")
	public MensajePersonalizado consultaProyectosAprobados(@PathVariable int idAnhio, @PathVariable int trimestre) {
		var response = proyectoService.consultaProyectoAprobado(idAnhio, trimestre);
		return new MensajePersonalizado<> ("200", "Exitoso", response);
	}	
	
}
