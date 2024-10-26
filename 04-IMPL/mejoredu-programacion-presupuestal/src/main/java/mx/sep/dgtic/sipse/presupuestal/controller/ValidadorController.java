package mx.sep.dgtic.sipse.presupuestal.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ValidacionDTO;
import mx.sep.dgtic.sipse.presupuestal.service.ValidacionService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/programacion/validacion")
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
	
	@GetMapping("consultarRevision/{apartado}/{id}/{cveUsuario}")
	@Produces(MediaType.APPLICATION_JSON)

	public MensajePersonalizado<ValidacionDTO> consultarRevision(@PathVariable String apartado, @PathVariable Integer id, @PathVariable String cveUsuario) {
		Log.info("Iniciando servicio de guardado de validaciones");
		MensajePersonalizado<ValidacionDTO> respuesta = validacionService.consultarRevision(apartado,id,cveUsuario);
		Log.info("Termina servicio de guardado de validaciones");
		return respuesta ;
	}
}
