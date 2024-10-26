package mx.sep.dgtic.mejoredu.seguimiento.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.quarkus.logging.Log;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.jasper.JasperReportResponse;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionSolicitudDTO;
import mx.sep.dgtic.mejoredu.seguimiento.SolicitudDTO;
import mx.sep.dgtic.mejoredu.seguimiento.service.SolicitudSeguimientoService;

@RestController
@RequestMapping({ "/api/solicitud-seguimiento" })
public class SolicitudSeguimientoController {
	@Inject
	private SolicitudSeguimientoService solicitudSeguimientoService;

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<SolicitudDTO.IdSolicitud> registrar(SolicitudDTO solicitud) {
		Log.debug("Iniciando registro de solicitud: " + solicitud.toString());
		return new MensajePersonalizado<>("200", "Exitoso", solicitudSeguimientoService.registrar(solicitud));
	}

	@PatchMapping("/consulta-por-usuario/{usuario}")
	public MensajePersonalizado<List<SolicitudDTO>> consultaPorUsuario(@PathVariable String usuario,
			@RequestBody PeticionSolicitudDTO solicitud) {
		List<SolicitudDTO> solicitudes = this.solicitudSeguimientoService.consultaSolicitudes(usuario, solicitud);
		MensajePersonalizado<List<SolicitudDTO>> respuesta = new MensajePersonalizado<>("200", "Exitoso", solicitudes);
		return respuesta;
	}

	@GetMapping("/consulta-por-id/{id}")
	public MensajePersonalizado<SolicitudDTO> consultaPorId(@PathVariable int id) {
		var solicitud = this.solicitudSeguimientoService.consultaPorId(id);
		MensajePersonalizado<SolicitudDTO> respuesta = new MensajePersonalizado<>("200", "Exitoso", solicitud);
		return respuesta;
	}

	@PutMapping("/actualiza-por-id/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<String> actualizaPorId(@PathVariable int id, @RequestBody SolicitudDTO solicitud) {
		this.solicitudSeguimientoService.actualizaPorId(id, solicitud);
		MensajePersonalizado<String> respuesta = new MensajePersonalizado<>("200", "Exitoso",
				"actualizado correctamente");
		return respuesta;
	}

	@DeleteMapping("eliminar/{idSolicitud}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable int idSolicitud) {
		Log.debug("Iniciando eliminar ");
		solicitudSeguimientoService.eliminar(idSolicitud);
		return new RespuestaGenerica("200", "Exitoso");
	}

	@GetMapping("secuencialPorUnidad/{idUnidad}")
	public MensajePersonalizado<Integer> secuencialPorUnidad(@PathVariable int idUnidad) {
		Log.debug("Iniciando secuencialProyectoPorUnidad");

		MensajePersonalizado<Integer> secuencial = this.solicitudSeguimientoService.secuencialFolio(idUnidad);

		Log.debug("Terminando secuencialPorUnidad");
		return secuencial;
	}
	

	@GetMapping("secuencialPorAnhio/{idAnhio}")
	public MensajePersonalizado<Integer> secuencialPorAnhio(@PathVariable int idAnhio) {
		Log.debug("Iniciando secuencialProyectoPoAnhio");

		MensajePersonalizado<Integer> secuencial = this.solicitudSeguimientoService.secuencialFolioAnhio(idAnhio);

		Log.debug("Terminando secuencialPorAnhio");
		return secuencial;
	}

	@PutMapping("cambiarEstatus/{idEstatus}/{idSolicitud}/{cveUsuario}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica cambiarEstatus(@PathVariable Integer idEstatus, @PathVariable Integer idSolicitud,
			@PathVariable String cveUsuario) {
		Log.debug("Iniciando cambiarEstatus");

		RespuestaGenerica respuesta = solicitudSeguimientoService.cambiarEstatus(idEstatus, idSolicitud, cveUsuario);
		Log.debug("Terminando cambiarEstatus");
		return respuesta;
	}

	@GetMapping("descargaReporte/{idSolicitud}")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	@Transactional
	public Uni<Response> descargaReporte(@PathVariable Integer idSolicitud) {
		JasperReportResponse jrr = solicitudSeguimientoService.obtenerReporte(idSolicitud);
		return Uni.createFrom()
				.item(Response.ok()
						.header("Content-Disposition", "attachment;filename=" + jrr.getNombreArchivo() + ".pdf")
						.entity(new StreamingOutput() {
							@Override
							public void write(OutputStream output) throws IOException, WebApplicationException {
								output.write(jrr.getStreamByte());
								output.flush();
							}
						}).build());
	}

}
