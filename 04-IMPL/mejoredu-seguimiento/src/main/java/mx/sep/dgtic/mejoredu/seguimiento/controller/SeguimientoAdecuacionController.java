package mx.sep.dgtic.mejoredu.seguimiento.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguimiento.service.ISolicitudAdecuacionService;

@RestController
@RequestMapping("/api/seguimiento/adecuacion")
public class SeguimientoAdecuacionController {
	
	@Inject
	ISolicitudAdecuacionService solicitudAdecuacionService;

	@PutMapping("cambiarEstatus/{idEstatus}/{idAdecuacion}/{cveUsuario}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica cambiarEstatus(@PathVariable Integer idEstatus, @PathVariable Integer idAdecuacion, @PathVariable String cveUsuario) {
		Log.debug("Iniciando cambiarEstatus");
		
		RespuestaGenerica respuesta = solicitudAdecuacionService.cambiarEstatus(idEstatus,idAdecuacion,cveUsuario);
		Log.debug("Terminando cambiarEstatus");
		return respuesta;
	}
	
	

}
