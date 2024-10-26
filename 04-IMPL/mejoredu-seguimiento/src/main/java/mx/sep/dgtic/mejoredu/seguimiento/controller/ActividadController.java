package mx.sep.dgtic.mejoredu.seguimiento.controller;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.RespuestaAdecuacionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.RespuestaRegistroActividadVO;
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
import mx.sep.dgtic.mejoredu.seguimiento.ActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.PeticionCancelacionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.service.ActividadService;

@RestController
@RequestMapping("/api/seguimiento/actividades")
public class ActividadController {
	@Inject
	private ActividadService actividadService;

	@GetMapping("consultaPorProyectoSolicitud")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ActividadVO>> consultaPorProyectoSolicitud(@RequestParam int idProyecto,
			@RequestParam(defaultValue = "false") boolean excluirCortoPlazo, @RequestParam int idSolicitud) {
		Log.debug("Iniciando consultaPorProyectoSolicitud");
		Log.debug("consultaPorProyectoSolicitud por : " + idProyecto);

		var actividades = actividadService.consultarPorIdProyectoSolicitud(idProyecto, excluirCortoPlazo, idSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);

		Log.debug("Termina consultaPorProyectoSolicitud");
		return respuesta;
	}

	@GetMapping("consultarActividadModificacion/{idAdecuacionSolicitud}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<RespuestaAdecuacionActividadVO>> consultarActividadModificacion(@PathVariable int idAdecuacionSolicitud) {
		Log.debug("Iniciando consultarActividadModificacion");
		Log.debug("consultarActividadModificacion por : " + idAdecuacionSolicitud);
		var actividad = actividadService.consultarActividadModificacion(idAdecuacionSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividad);
		Log.debug("Termina consultarActividadModificacion");
		return respuesta;
	}

	@GetMapping("consultarActividadCancelacion/{idAdecuacionSolicitud}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<RespuestaAdecuacionActividadVO>> consultarActividadCancelacion(@PathVariable int idAdecuacionSolicitud) {
		Log.debug("Iniciando consultarActividadCancelacion");
		Log.debug("consultarActividadCancelacion por : " + idAdecuacionSolicitud);
		var actividad = actividadService.consultarActividadCancelacion(idAdecuacionSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividad);
		Log.debug("Termina consultarActividadCancelacion");
		return respuesta;
	}

	@GetMapping("consultaPorProyecto/{idProyecto}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ActividadVO>> consultaPorAnhio(@PathVariable int idProyecto) {
		Log.debug("Iniciando consultaPorAnhio");
		Log.debug("consultaProyectosPorAnhio por : " + idProyecto);
		var actividades = actividadService.consultarPorIdProyecto(idProyecto, "");
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);
		Log.debug("Termina consultaPorAnhio");
		return respuesta;
	}

	@GetMapping("consultaPorProyecto/{idProyecto}/{estatus}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ActividadVO>> consultaPorAnhioEstatus(@PathVariable int idProyecto,
			@PathVariable String estatus) {
		Log.debug("Iniciando consultaPorAnhio");
		Log.debug("consultaProyectosPorAnhio por : " + idProyecto);
		var actividades = actividadService.consultarPorIdProyecto(idProyecto, estatus);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);
		Log.debug("Termina consultaPorAnhio");
		return respuesta;
	}

	@GetMapping("consultarPorID/{idActividad}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<ActividadVO> consultarPorID(@PathVariable int idActividad) {
		Log.debug("Iniciando consultarPorID ");
		Log.debug("consultarPorID por : " + idActividad);
		MensajePersonalizado<ActividadVO> respuesta;
		try {
			var actividad = actividadService.consultarPorIdActividad(idActividad);
			respuesta = new MensajePersonalizado<>("200", "Exitoso", actividad);
		} catch (Exception e) {
			respuesta = new MensajePersonalizado<>("500", "Error no existen actividad con el id: " + idActividad, null);
		}
		Log.debug("Termina consultarPorID ");
		return respuesta;
	}

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<RespuestaRegistroActividadVO> registrar(PeticionActividadVO registroActividad) {
		Log.debug("Iniciando registrar ");
		Log.debug("registrar por : " + registroActividad.getIdProyecto());

		var respuestaRegistro = actividadService.registrar(registroActividad);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", respuestaRegistro);

		Log.debug("Termina registrar ");
		return respuesta;
	}

	@PutMapping("modificar/{idActividad}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica modificar(@PathVariable int idActividad, @RequestBody PeticionActividadVO peticion) {
		Log.debug("Iniciando modificar ");
		Log.debug("modificar por : " + idActividad);
		actividadService.modificar(idActividad, peticion);
		var respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Termina modificar ");
		return respuesta;
	}

	@PutMapping("eliminar/{idActividad}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable int idActividad) {
		Log.debug("Iniciando eliminar ");
		Log.debug("eliminar por : " + idActividad);
		actividadService.eliminar(idActividad);
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Termina eliminar ");
		return respuesta;
	}

	@PutMapping("eliminarAdecuacion")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminarAdecuacion(@RequestBody PeticionEliminarModificacion peticion) {
		Log.debug("Iniciando eliminarAdecuacion");
		actividadService.eliminarAdecuacion(peticion);
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Termina eliminarAdecuacion");
		return respuesta;
	}

	@PutMapping("cancelarActividad")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica cancelarActividad(@RequestBody PeticionCancelacionActividadVO peticion) {
		Log.debug("Iniciando cancelarActividad");
		actividadService.cancelarActividad(peticion);
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Termina cancelarActividad");
		return respuesta;
	}

	@GetMapping("secuencialPorProyecto/{idProyecto}")
	public MensajePersonalizado<Integer> secuencialActividadPorUnidad(@PathVariable int idProyecto) {
		return actividadService.secuencialPorProyecto(idProyecto);
	}

}
