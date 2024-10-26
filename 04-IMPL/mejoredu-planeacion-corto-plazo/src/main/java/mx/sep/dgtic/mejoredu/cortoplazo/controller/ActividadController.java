package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionActividad;
import mx.sep.dgtic.mejoredu.cortoplazo.ActividadVO;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ActividadService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {
	@Inject
	private ActividadService actividadService;

	@GetMapping("consultaPorProyecto/{idProyecto}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ActividadVO>> consultaPorAnhio(@PathVariable int idProyecto) {
		Log.debug("Iniciando consultaPorAnhio");
		Log.debug("consultaProyectosPorAnhio por : " + idProyecto);
		var actividades = actividadService.consultarPorIdProyecto(idProyecto,"A");
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", actividades);
		Log.debug("Termina consultaPorAnhio");
		return respuesta;
	}
	
	@GetMapping("consultaPorProyecto/{idProyecto}/{estatus}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ActividadVO>> consultaPorAnhioEstatus(@PathVariable int idProyecto, @PathVariable String estatus) {
		Log.debug("Iniciando consultaPorAnhio");
		Log.debug("consultaProyectosPorAnhio por : " + idProyecto);
		var actividades = actividadService.consultarPorIdProyecto(idProyecto,estatus);
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
	public RespuestaGenerica registrar(PeticionActividad registroActividad) {
		Log.debug("Iniciando registrar ");
		Log.debug("registrar por : " + registroActividad.getIdProyecto());
		actividadService.registrar(registroActividad);
		var respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Termina registrar ");
		return respuesta;
	}

	@PutMapping("modificar/{idActividad}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica modificar(@PathVariable int idActividad, @RequestBody PeticionActividad peticion) {
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

}
