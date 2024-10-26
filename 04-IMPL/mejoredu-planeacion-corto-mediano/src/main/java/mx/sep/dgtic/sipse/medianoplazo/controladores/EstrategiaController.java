package mx.sep.dgtic.sipse.medianoplazo.controladores;

import java.util.ArrayList;
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
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.EstrategiaDTO;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IEstrategiaService;

@RestController
@RequestMapping("api/medianoplazo/estrategia")
public class EstrategiaController {

	@Inject
	IEstrategiaService estrategiaService;

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

	@GetMapping("consultarCatalogoObjetivos/{anhio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarCatalogoObjetivos(@PathVariable("anhio") Integer anhio) {
		Log.info("Arrancando endpoint consultarOpcionCatalogoADto");

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

		var catalogos = estrategiaService.consultarCatalogoObjetivos(anhio);

		respuestaCat.setCatalogo(catalogos);

		Log.info("Terminando endpoint consultarOpcionCatalogoADto");
		return respuestaCat;
	}

	@GetMapping("consultarPorID/{idEstrategia}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<EstrategiaDTO>> consultarPorID(
			@PathVariable("idEstrategia") Integer idEstrategia) {
		Log.info("Iniciando consultaPorID :" + idEstrategia);
		MensajePersonalizado<List<EstrategiaDTO>> respusta = estrategiaService.consultarActivosPorId(idEstrategia);
		Log.info("Termina consultaPorID.");
		return respusta;
	}

	@GetMapping("consultarActivos/{idObjetivo}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<EstrategiaDTO>> consultarActivos(@PathVariable("idObjetivo") String idObjetivo) {
		Log.info("Iniciando consultaTodos");
		MensajePersonalizado<List<EstrategiaDTO>> respuesta = estrategiaService.consultarActivos(idObjetivo);
		Log.info("Termina consultaPorID.");
		return respuesta;
	}

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)

	public RespuestaGenerica registrar(@RequestBody EstrategiaDTO peticion) {
		RespuestaGenerica respuesta = estrategiaService.registrar(peticion);
		return respuesta;
	}

	@PutMapping("modificar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)

	public RespuestaGenerica modificar(@RequestBody EstrategiaDTO peticion) {
		RespuestaGenerica respuesta = estrategiaService.modificar(peticion);
		return respuesta;
	}

	@PutMapping("eliminar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@RequestBody EstrategiaDTO peticion) {
		
		RespuestaGenerica respuesta = estrategiaService.eliminar(peticion );
		return respuesta;
	}
}
