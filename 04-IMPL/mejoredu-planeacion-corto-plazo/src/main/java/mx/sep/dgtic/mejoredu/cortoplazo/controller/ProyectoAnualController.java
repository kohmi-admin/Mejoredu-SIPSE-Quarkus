package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import java.io.InputStream;
import java.util.List;

import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
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
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ApartadoProyectoEstatus;
import mx.sep.dgtic.mejoredu.cortoplazo.ActualizarProyectoAnual;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ProyectoAnualService;

@RestController
@RequestMapping("/api/proyecto-anual")
public class ProyectoAnualController {
	@Inject
	private ProyectoAnualService proyectoAnualService;

	@PutMapping("modificarProyectosPorID/{idProyectoAnual}")
	public RespuestaGenerica actualizarProyectoAnual(@PathVariable int idProyectoAnual,
			@RequestBody ActualizarProyectoAnual peticionProyecto) {
		Log.debug("Iniciando actualizarProyectoAnual");
		proyectoAnualService.actualizarProyectoAnual(idProyectoAnual, peticionProyecto);
		var respuesta = new RespuestaGenerica("200", "Exitoso");
		Log.debug("Terminando actualizarProyectoAnual");
		return respuesta;
	}

	@GetMapping("secuencialProyectoAnual/{idAnhio}/{idUnidad}")
	public MensajePersonalizado<Integer> secuencialProyectoPorUnidad(@PathVariable int idUnidad, @PathVariable int idAnhio) {
		Log.debug("Iniciando secuencialProyectoPorUnidad");

		MensajePersonalizado<Integer> secuencial = proyectoAnualService.secuencialProyectoAnual(idAnhio, idUnidad);

		Log.debug("Terminando secuencialProyectoPorUnidad");
		return secuencial;
	}

	@GetMapping("wordToPdf/{uuid}")
	public MensajePersonalizado<String> wordToPdf(@PathVariable String uuid) {
		return new MensajePersonalizado<>("200", "Archivo convertido con éxito, se deja en alfresco con UUID:",
				proyectoAnualService.getUiidPdfAlfresco(uuid));
	}

	@PostMapping("excelToMysql/{cveUsuario}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public RespuestaGenerica cargaExcel(@FormParam("file")
    @PartType(MediaType.APPLICATION_OCTET_STREAM)InputStream file, @PathVariable String cveUsuario) {
		Log.debug("Iniciando excelToMysql");
		RespuestaGenerica respuesta = proyectoAnualService.cargaExcel(file, cveUsuario);

		Log.debug("Terminando excelToMysql");
		return respuesta;
	}

	@PutMapping("finalizarRegistro")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica finalizarRegistro(PeticionPorID peticion) {
		RespuestaGenerica respuesta = proyectoAnualService.finalizarRegistro(peticion);
		return respuesta;
	}

	@PutMapping("enviarARevisar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica enviarARevisar(PeticionPorID peticion) {
		RespuestaGenerica respuesta = proyectoAnualService.enviarRevision(peticion);
		return respuesta;
	}

	@PutMapping("enviarAValidacionTecnica")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica enviarAValidacionTecnica(PeticionPorID peticion) {
		RespuestaGenerica respuesta = proyectoAnualService.enviarValidacionTecnica(peticion);
		return respuesta;
	}

	@PutMapping("registroAprobado")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registroAprobado(PeticionPorID peticion) {
		RespuestaGenerica respuesta = proyectoAnualService.registroAprobado(peticion);
		return respuesta;
	}
	

	@GetMapping("consultarProyectoCompleto/{idProyecto}")
	public MensajePersonalizado<List<ApartadoProyectoEstatus>> consultarProyectoCompleto(@PathVariable int idProyecto) {
		List<ApartadoProyectoEstatus> response = proyectoAnualService.consultarProyectoCompleto(idProyecto);
		return new MensajePersonalizado<List<ApartadoProyectoEstatus>> ("200", "Exitoso", response);
	}
}
