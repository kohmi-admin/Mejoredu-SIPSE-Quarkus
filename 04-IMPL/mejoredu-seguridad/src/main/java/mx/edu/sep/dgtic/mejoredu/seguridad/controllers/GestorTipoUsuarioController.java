package mx.edu.sep.dgtic.mejoredu.seguridad.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.GestorTipoUsuarioService;
import mx.sep.dgtic.mejoredu.seguridad.TipoUsuarioVO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rol")
public class GestorTipoUsuarioController {
	@Inject
	GestorTipoUsuarioService gestorTipoUsuarioService;
	
	@GetMapping("consultarTodos")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TipoUsuarioVO> consultarTodos(){

		List<TipoUsuarioVO> respuesta = gestorTipoUsuarioService.consultarTodo();

		return respuesta;
	}


	@GetMapping("consultarPorId/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<TipoUsuarioVO> consultarPorId(@PathVariable int id) {
		MensajePersonalizado<TipoUsuarioVO> respuesta = gestorTipoUsuarioService.consultarPorId(id);
		return respuesta;
	}

	@PutMapping("modificar/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica modificar(@PathVariable int id, @RequestBody TipoUsuarioVO peticion) {
		RespuestaGenerica respuesta = gestorTipoUsuarioService.modificar(id, peticion);
		return respuesta;
	}
	
	@PutMapping("eliminar/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable int id) {
		RespuestaGenerica respuesta = gestorTipoUsuarioService.eliminar(id);
		return respuesta;
	}

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registrar(TipoUsuarioVO peticion) {
		RespuestaGenerica respuesta = gestorTipoUsuarioService.registrar(peticion);
		return respuesta;
	}
	
	
}
