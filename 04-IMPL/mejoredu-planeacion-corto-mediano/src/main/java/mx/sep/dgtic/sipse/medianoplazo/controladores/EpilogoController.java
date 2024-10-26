package mx.sep.dgtic.sipse.medianoplazo.controladores;

import java.util.List;

import mx.sep.dgtic.mejoredu.medianoplazo.dtos.RespuestaReporteMedianoPlazo;
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
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.EpilogoArchivoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionEpilogoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.RespuestaEpilogoDTO;
import mx.sep.dgtic.sipse.medianoplazo.servicios.EpilogoService;

@RestController
@RequestMapping("/api/medianoplazo/epilogo")
public class EpilogoController {
	@Inject
	private EpilogoService epilogoService;

	@GetMapping("/consultarPorIdEstructura/{idEstructura}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<RespuestaEpilogoDTO> consultarPorIdEstructura(@PathVariable Integer idEstructura) {
		Log.info("Iniciando consultarPorIdEstructura");
		Log.info("consultarPorIdEstructura por : " + idEstructura);

		var epilogo = epilogoService.consultarPorIdEstructura(idEstructura);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", epilogo);

		Log.info("Termina consultarPorIdEstructura");
		return respuesta;
	}

	@GetMapping("/consultarPorID/{idEpilogo}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<RespuestaEpilogoDTO> consultarPorID(@PathVariable Integer idEpilogo) {
		Log.info("Iniciando consultarPorID");
		Log.info("consultarPorID por : " + idEpilogo);

		var epilogo = epilogoService.consultarPorId(idEpilogo);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", epilogo);

		Log.info("Termina consultarPorID");
		return respuesta;
	}

	@PostMapping("/registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registrar(@RequestBody PeticionEpilogoDTO epilogo) {
		Log.info("Iniciando registrar");
		Log.info("registrar por Id Estructura: " + epilogo.getIdEstructura());

		epilogoService.registrar(epilogo);
		var respuesta = new RespuestaGenerica("200", "Exitoso");

		Log.info("Termina registrar.");
		return respuesta;
	}

	@PutMapping("/modificar/{idEpilogo}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica modificar(@PathVariable Integer idEpilogo, @RequestBody PeticionEpilogoDTO epilogo) {
		Log.info("Iniciando modificar");
		Log.info("modificar por Id Epilogo: " + idEpilogo);

		epilogoService.modificar(epilogo, idEpilogo);
		var respuesta = new RespuestaGenerica("200", "Exitoso");

		Log.info("Termina modificar.");
		return respuesta;
	}

	@PutMapping("/eliminar/{idEpilogo}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable Integer idEpilogo) {
		Log.info("Iniciando eliminar");
		Log.info("eliminar por Id Epilogo: " + idEpilogo);

		epilogoService.eliminar(idEpilogo);
		var respuesta = new RespuestaGenerica("200", "Exitoso");

		Log.info("Termina eliminar.");
		return respuesta;
	}

	@GetMapping("/consultarArchivos/{idEpilogo}/{tipoDocumento}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<EpilogoArchivoDTO>> consultarArchivos(@PathVariable Integer idEpilogo,
			@PathVariable Integer tipoDocumento) {
		Log.info("Iniciando consultarArchivos");
		Log.info("consultarArchivos por Id Epilogo: " + idEpilogo + " y tipoDocumento: " + tipoDocumento);

		var archivos = epilogoService.consultarArchivosPorId(idEpilogo, tipoDocumento);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", archivos);

		Log.info("Termina consultarArchivos.");
		return respuesta;
	}

	@GetMapping("/consultarArchivos/{idEpilogo}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<EpilogoArchivoDTO>> consultarArchivos(@PathVariable Integer idEpilogo) {
		Log.info("Iniciando consultarArchivos");
		Log.info("consultarArchivos por Id Epilogo: " + idEpilogo);

		var archivos = epilogoService.consultarArchivosPorId(idEpilogo);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", archivos);

		Log.info("Termina consultarArchivos.");
		return respuesta;
	}

	@GetMapping("/consultarReporte/{anio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<RespuestaReporteMedianoPlazo> consultarReporte(@PathVariable Integer anio) {
		Log.info("Iniciando consultarReporte");
		Log.info("consultarReporte por anio: " + anio);

		var reporte = epilogoService.consultarReporte(anio);
		var respuesta = new MensajePersonalizado<>("200", "Exitoso", reporte);

		Log.info("Termina consultarReporte.");
		return respuesta;
	}

	@GetMapping("descargaReporte/{anio}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica descargaReporte(@PathVariable Integer anio) {
		return epilogoService.generaReporte(anio);
	}
}
