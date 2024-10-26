package mx.edu.sep.dgtic.mejoredu.seguridad.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.PeriodoHabilitacion;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.GestorPeriodoHabilitacionService;
import mx.sep.dgtic.mejoredu.seguridad.PeriodosHabilitacionVO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/periodos")
public class GestorPeriodosHabilitacionController {
	@Inject
	GestorPeriodoHabilitacionService gestorPeriodoHabilitacionService;
	
	@GetMapping("consultarTodos")
	@Produces(MediaType.APPLICATION_JSON)
	public List<PeriodosHabilitacionVO> consultarTodos(){

		List<PeriodosHabilitacionVO> respuesta = gestorPeriodoHabilitacionService.consultarTodo();

		return respuesta;
	}


	@GetMapping("consultarPorId/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public PeriodosHabilitacionVO consultarPorId(@PathVariable int id) {
		PeriodosHabilitacionVO respuesta = gestorPeriodoHabilitacionService.consultarPorId(id);
		return respuesta;
	}

	@PutMapping("modificar/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica modificar(@PathVariable int id, @RequestBody PeriodosHabilitacionVO peticion) {
		RespuestaGenerica respuesta = gestorPeriodoHabilitacionService.modificar(id, peticion);
		return respuesta;
	}
	
	@PutMapping("eliminar/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable int id) {
		RespuestaGenerica respuesta = gestorPeriodoHabilitacionService.eliminar(id);
		return respuesta;
	}

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registrar(PeriodosHabilitacionVO peticion) {
		RespuestaGenerica respuesta = gestorPeriodoHabilitacionService.registrar(peticion);
		return respuesta;
	}
	
	
}
