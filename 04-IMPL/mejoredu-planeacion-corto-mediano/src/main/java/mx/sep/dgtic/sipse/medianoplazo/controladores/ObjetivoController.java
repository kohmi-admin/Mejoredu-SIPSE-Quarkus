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
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ObjetivoDTO;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IMasterCatalogoService;

@RestController
@RequestMapping("api/medianoplazo/objetivo")
public class ObjetivoController {
	
	@Inject
	IMasterCatalogoService catalogoService;
	
	@GetMapping("version")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<String> getVersion() {
		MensajePersonalizado<String> respusta = new MensajePersonalizado<String>();
		respusta.setCodigo("200");
		respusta.setMensaje("Exitoso");
		respusta.setRespuesta("20231025");
		return respusta;
	}

	@GetMapping("consultarCatalogoObjetivos/{anhio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarCatalogoObjetivos(@PathVariable("anhio") Integer anhio) {
		Log.info("Arrancando endpoint consultarOpcionCatalogoADto");

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

		var catalogos = catalogoService.consultarCatalogoObjetivos(anhio);

		respuestaCat.setCatalogo(catalogos);

		Log.info("Terminando endpoint consultarOpcionCatalogoADto");
		return respuestaCat;
	}
	
	@GetMapping("consultarPorID/{idObjetivo}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<ObjetivoDTO> consultarPorID(@PathVariable("idObjetivo") Integer idObjetivo) {
		Log.info("Iniciando consultaPorID :" + idObjetivo);
		MensajePersonalizado<ObjetivoDTO> respusta = new MensajePersonalizado<ObjetivoDTO>();
		ObjetivoDTO objetivoDto = new ObjetivoDTO();
		objetivoDto.setCdObjetivo("Descripción del objetivo");
		objetivoDto.setIdObjetivo(1);
		objetivoDto.setIxObjetivo(1);
		objetivoDto.setRelevancia("Relevancia del objetivo");
		respusta.setCodigo("200");
		respusta.setMensaje("Exitoso");
		respusta.setRespuesta(objetivoDto);
		Log.info("Termina consultaPorID.");
		return respusta;
	}
	
	@GetMapping("consultarActivos")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<ObjetivoDTO>> consultarActivos() {
		Log.info("Iniciando consultaTodos");
		MensajePersonalizado<List<ObjetivoDTO>> respuesta = catalogoService.consultarObjetivos();
		Log.info("Termina consultaPorID.");
		return respuesta;
	}

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public RespuestaGenerica registrar(@RequestBody ObjetivoDTO peticion) {
		RespuestaGenerica respuesta = catalogoService.registrar(peticion);
		return respuesta ;
	}
	
	@PutMapping("modificar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public RespuestaGenerica modificar(@RequestBody ObjetivoDTO peticion) {
		RespuestaGenerica respuesta = catalogoService.modificar(peticion);
		return respuesta ;
	}
	
	@PutMapping("eliminar/{idObjetivo}/{cveUsuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable Integer idObjetivo, @PathVariable String cveUsuario) {
		MasterCatalogoDTO peticion = new MasterCatalogoDTO();
		peticion.setIdCatalogo(idObjetivo);
		peticion.setCveUsuario(cveUsuario);
		RespuestaGenerica respuesta = catalogoService.eliminar(peticion);
		return respuesta ;
	}

}
