package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ValidacionService;
import mx.sep.dgtic.mejoredu.cortoplazo.ValidacionDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/cortoplazo/validacion")
public class ValidadorController {

	@Inject
	ValidacionService validacionService;

	@PostMapping("guardar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)

	public RespuestaGenerica guardar(@RequestBody ValidacionDTO peticion) {
		Log.info("Iniciando servicio de guardado de validaciones");
		RespuestaGenerica respuesta = validacionService.guardar(peticion);
		Log.info("Termina servicio de guardado de validaciones");
		return respuesta ;
	}
	
	@GetMapping("consultarRevision/{apartado}/{id}/{rol}")
	@Produces(MediaType.APPLICATION_JSON)

	public MensajePersonalizado<ValidacionDTO> consultarRevision(@PathVariable String apartado, @PathVariable Integer id, @PathVariable String rol) {
		Log.info("Iniciando servicio de guardado de validaciones");
		MensajePersonalizado<ValidacionDTO> respuesta = validacionService.consultarRevision(apartado,id, rol);
		Log.info("Termina servicio de guardado de validaciones");
		return respuesta ;
	}
}