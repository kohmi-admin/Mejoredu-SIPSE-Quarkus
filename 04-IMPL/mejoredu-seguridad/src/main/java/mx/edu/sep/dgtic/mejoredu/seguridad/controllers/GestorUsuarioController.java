package mx.edu.sep.dgtic.mejoredu.seguridad.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.IGestorUsuarioService;
import mx.sep.dgtic.mejoredu.seguridad.PeticionUsuario;

@RestController
@RequestMapping("/api/usuario")
public class GestorUsuarioController {
	
	@Inject
	IGestorUsuarioService usuarioService;

	
	@GetMapping("consultarPorID/{cveUsuario}")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<PeticionUsuario> consultarPorID(@PathVariable String cveUsuario){
		
		
		return usuarioService.consultarPorId(cveUsuario);
		
	}
	@GetMapping("consultarTodos")
	@Produces(MediaType.APPLICATION_JSON)
	public List<PeticionUsuario> consultarTodos(){

		List<PeticionUsuario>  respuesta = usuarioService.consultarTodos();
		return respuesta;
	}

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registrar( PeticionUsuario peticion) {
		RespuestaGenerica respuesta = usuarioService.registrar(peticion);
		return respuesta;
	}

	@PutMapping("modificar/{cveUsuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica modificar(@PathVariable String cveUsuario, @RequestBody PeticionUsuario peticion) {
		RespuestaGenerica respuesta = usuarioService.modificar(cveUsuario,peticion);
		return respuesta;
	}

	@PutMapping("eliminar/{cveusuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable String cveusuario) {
		RespuestaGenerica respuesta = usuarioService.eliminar(cveusuario);
		return respuesta;
	}
	
	
}
