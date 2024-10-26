package mx.sep.dgtic.mejoredu.seguimiento.controller;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.accion.*;
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
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguimiento.service.AccionService;

@RestController
@RequestMapping("/api/seguimiento/acciones")
public class AccionesController {
	@Inject
	private AccionService accionService;

	@GetMapping("/consultarAcciones")
	public MensajePersonalizado<List<RespuestaAccionVO>> consultarAcciones(@RequestParam int idProducto,
			@RequestParam(defaultValue = "false") boolean excluirCortoPlazo, @RequestParam int idSolicitud) {
		Log.info("Iniciando consultarPresupuestosPorIdProducto");
		Log.info("consultarPresupuestosPorIdProducto por : " + idProducto);

		var presupuestos = accionService.consultarPorProductoSolicitud(idProducto, excluirCortoPlazo, idSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

		Log.info("Termina consultarPresupuestosPorIdProducto");
		return respuesta;
	}

	@GetMapping("/consultarAccionesModificacion/{idAdecuacionSolicitud}")
	public MensajePersonalizado<List<RespuestaAdecuacionAccionVO>> consultarAccionesModificacion(@PathVariable int idAdecuacionSolicitud) {
		Log.info("Iniciando consultarPresupuestosPorIdProducto");
		Log.info("consultarPresupuestosPorIdProducto por : " + idAdecuacionSolicitud);

		var presupuestos = accionService.consultarAccionModificacion(idAdecuacionSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

		Log.info("Termina consultarPresupuestosPorIdProducto");
		return respuesta;
	}

	@GetMapping("/consultarAccionesCancelacion/{idAdecuacionSolicitud}")
	public MensajePersonalizado<List<RespuestaAdecuacionAccionVO>> consultarAccionesCancelacion(@PathVariable int idAdecuacionSolicitud) {
		Log.info("Iniciando consultarPresupuestosPorIdProducto");
		Log.info("consultarPresupuestosPorIdProducto por : " + idAdecuacionSolicitud);

		var presupuestos = accionService.consultarAccionCancelacion(idAdecuacionSolicitud);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

		Log.info("Termina consultarPresupuestosPorIdProducto");
		return respuesta;
	}

	@GetMapping("/consultarAccionesPorId/{idAccion}")
	public MensajePersonalizado<RespuestaAccionVO> consultarAccionesPorId(@RequestParam int idAccion) {
		Log.info("Iniciando consultarPresupuestosPorIdProducto");
		Log.info("consultarPresupuestosPorIdProducto por : " + idAccion);

		var presupuestos = accionService.consultarPorId(idAccion);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", presupuestos);

		Log.info("Termina consultarPresupuestosPorIdProducto");
		return respuesta;
	}

	@PostMapping("/registrar")
	public MensajePersonalizado<RespuestaRegistroAccionVO> registrarAccion(@RequestBody PeticionAccionVO peticion) {
		Log.info("Iniciando registrarPresupuesto");
		Log.info("registrarPresupuesto por : " + peticion.getIdProducto());

		var respuestaRegistro = accionService.registrar(peticion);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", respuestaRegistro);

		Log.info("Termina registrarPresupuesto");
		return respuesta;
	}

	@PutMapping("/modificar/{idAccion}")
	public RespuestaGenerica modificarAccion(@PathVariable int idAccion, @RequestBody PeticionAccionVO peticion) {
		Log.info("Iniciando editarPresupuesto");
		Log.info("editarPresupuesto por : " + idAccion);

		accionService.modificar(idAccion, peticion);
		var respuesta = new RespuestaGenerica("200", "Exitoso");

		Log.info("Termina editarPresupuesto");
		return respuesta;
	}

	@PutMapping("/cancelar")
	public RespuestaGenerica cancelarAccion(@RequestBody PeticionCancelacionAccionVO peticion) {
		Log.info("Iniciando cancelarPresupuesto");
		Log.info("cancelarPresupuesto por : " + peticion.getIdAccionReferencia());

		accionService.cancelarAccion(peticion);
		var respuesta = new RespuestaGenerica("200", "Exitoso");

		Log.info("Termina cancelarPresupuesto");
		return respuesta;
	}

	@PutMapping("/eliminar/{idAccion}")
	public RespuestaGenerica eliminarPresupuesto(@PathVariable int idAccion) {
		Log.info("Iniciando eliminarPresupuesto");
		Log.info("eliminarPresupuesto por : " + idAccion);

		accionService.eliminar(idAccion);
		var respuesta = new RespuestaGenerica("200", "Exitoso");

		Log.info("Termina eliminarPresupuesto");
		return respuesta;
	}

	@PutMapping("/eliminarAdecuacion")
	public RespuestaGenerica eliminarAdecuacion(@RequestBody PeticionEliminarModificacion peticion) {
		Log.info("Iniciando eliminarAdecuacion");
		accionService.eliminarAdecuacion(peticion);
		var respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.info("Termina eliminarAdecuacion");
		return respuesta;
	}

	@GetMapping("secuencialPorProducto/{idProducto}")
	public MensajePersonalizado<Integer> secuencialPorProducto(@PathVariable Integer idProducto) {
		return accionService.secuencialPorProducto(idProducto);
	}
}
