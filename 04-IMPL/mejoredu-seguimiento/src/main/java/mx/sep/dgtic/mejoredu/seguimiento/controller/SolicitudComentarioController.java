package mx.sep.dgtic.mejoredu.seguimiento.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguimiento.ComentarioSolicitudDTO;
import mx.sep.dgtic.mejoredu.seguimiento.service.SolicitudComentarioService;

@RestController
@RequestMapping({ "/api/solicitud/comentario" })
public class SolicitudComentarioController {
	@Inject
	private SolicitudComentarioService comentarioService;

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registrar(ComentarioSolicitudDTO comentario) {
		comentarioService.registrar(comentario);
		return new RespuestaGenerica("200", "Exitoso");
	}

	@GetMapping("/consultaPorIdSolicitud/{idSolicitud}")
	public MensajePersonalizado<List<ComentarioSolicitudDTO>> consultaPorIdSolicitud(
			@PathVariable Integer idSolicitud) {
		return new MensajePersonalizado<>("200", "Exitoso", this.comentarioService.consultaPorIdSolicitud(idSolicitud));
	}

	@GetMapping("/consultaPorId/{id}")
	public MensajePersonalizado<ComentarioSolicitudDTO> consultaPorId(@PathVariable Integer id) {
		return new MensajePersonalizado<>("200", "Exitoso", this.comentarioService.consultaPorId(id));
	}

	@PutMapping("/actualizaPorId/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<String> actualizaPorId(@PathVariable Integer id,
			@RequestBody ComentarioSolicitudDTO solicitud) {
		this.comentarioService.actualizaPorId(id, solicitud);
		return new MensajePersonalizado<>("200", "Exitoso", "actualizado correctamente");
	}

	@DeleteMapping("eliminar/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable int id) {
		comentarioService.eliminar(id);
		return new RespuestaGenerica("200", "Exitoso");
	}

}
