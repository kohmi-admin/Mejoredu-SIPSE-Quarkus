package mx.sep.dgtic.mejoredu.seguimiento.controller;

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
import mx.sep.dgtic.mejoredu.seguimiento.SolicitudFirmaDTO;
import mx.sep.dgtic.mejoredu.seguimiento.service.SolicitudFirmaService;

@RestController
@RequestMapping({ "/api/solicitud/firma" })
public class SolicitudFirmaController {
	@Inject
	private SolicitudFirmaService firmaService;

	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<Integer> registrar(SolicitudFirmaDTO comentario) {
		
		MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		respuesta.setRespuesta(firmaService.registrar(comentario));
		return respuesta;
	}

	@GetMapping("/consultaPorId/{id}")
	public MensajePersonalizado<SolicitudFirmaDTO> consultaPorId(@PathVariable Integer id) {
		return new MensajePersonalizado<>("200", "Exitoso", this.firmaService.consultaPorId(id));
	}

	@PutMapping("/actualizaPorId/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<String> actualizaPorId(@PathVariable Integer id,
			@RequestBody SolicitudFirmaDTO solicitud) {
		this.firmaService.actualizaPorId(id, solicitud);
		return new MensajePersonalizado<>("200", "Exitoso", "actualizado correctamente");
	}

	@DeleteMapping("eliminar/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable int id) {
		firmaService.eliminar(id);
		return new RespuestaGenerica("200", "Exitoso");
	}

}
