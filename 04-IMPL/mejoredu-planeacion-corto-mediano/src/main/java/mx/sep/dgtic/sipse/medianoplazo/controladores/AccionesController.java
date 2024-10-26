package mx.sep.dgtic.sipse.medianoplazo.controladores;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.RespuestaCatalogo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.AccionDTO;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IAccionService;

@RestController
@RequestMapping("api/medianoplazo/accion")
public class AccionesController {
	
	@Inject
	IAccionService accionService;
	
	
	@GetMapping("version")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<String> getVersion() {
		MensajePersonalizado<String> respusta = new MensajePersonalizado<String>();
		respusta.setCodigo("200");
		respusta.setMensaje("Exitoso");
		respusta.setRespuesta("20231024");
		return respusta;
	}

	@GetMapping("consultarCatalogoAcciones/{anhio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarCatalogoAcciones(@PathVariable("anhio") Integer anhio) {
		Log.info("Arrancando endpoint consultarOpcionCatalogoADto");

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

		var catalogos = accionService.consultarCatalogoObjetivos(anhio);

		respuestaCat.setCatalogo(catalogos);

		Log.info("Terminando endpoint consultarOpcionCatalogoADto");
		return respuestaCat;
	}
	
	@GetMapping("consultarPorID/{idAccion}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<AccionDTO>> consultarPorID(@PathVariable("idAccion") Integer idAccion) {
		Log.info("Iniciando consultaPorID :" + idAccion);
		MensajePersonalizado<List<AccionDTO>> respuesta = accionService.consultarPorID(idAccion);
		Log.info("Termina consultaPorID.");
		return respuesta;
	}
	
	@GetMapping("consultarActivosPorEstrategia/{cveEstrategia}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<AccionDTO>> consultarActivos(@PathVariable("cveEstrategia") String cveEstrategia) {
		Log.info("Iniciando consultarActivos");
		MensajePersonalizado<List<AccionDTO>> respuesta = accionService.consultarActivos(cveEstrategia);
		
		Log.info("Termina consultaPorID.");
		return respuesta;
	}

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public RespuestaGenerica registrar(@RequestBody AccionDTO peticion) {
		RespuestaGenerica respuesta = accionService.registrar(peticion);
		return respuesta ;
	}
	
	@PutMapping("modificar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public RespuestaGenerica modificar(@RequestBody AccionDTO peticion) {
		RespuestaGenerica respuesta = accionService.modificar(peticion);
		return respuesta ;
	}
	
	@PutMapping("eliminar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@RequestBody AccionDTO peticion) {
		RespuestaGenerica respuesta = accionService.eliminar(peticion);
		return respuesta ;
	}
}
