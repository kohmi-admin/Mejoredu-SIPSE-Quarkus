package mx.edu.sep.dgtic.mejoredu.catalogos.controladores;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.*;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.servicios.GestorDireccionesService;
import mx.edu.sep.dgtic.mejoredu.catalogos.servicios.GestorUnidadService;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/Direcciones")
public class DireccionesController {
	@Inject
	GestorDireccionesService gestorDireccionesService;

	@PostMapping("agregarDireccion")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<MasterCatalogo> agregarDireccion(@RequestBody PeticionCatalogoDireccion peticion){
		Log.info("agregarDireccion");
		MensajePersonalizado<MasterCatalogo> respuesta = new MensajePersonalizado<>();
		respuesta.setRespuesta(gestorDireccionesService.agregarDireccion(peticion));
		if (respuesta.getRespuesta() == null) {
			respuesta.setCodigo("404");
			respuesta.setMensaje("No se pudo agregar la direccion");
		}
		else {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Se agrego la direccion");
		}
		return respuesta;
	}

	@GetMapping("listarDirecciones")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<MasterCatalogo>> listarDirecciones() {
		Log.info("listarDirecciones");
		MensajePersonalizado<List<MasterCatalogo>> respuesta = new MensajePersonalizado<>();
		respuesta.setRespuesta(gestorDireccionesService.listarDirecciones());
		if (respuesta.getRespuesta() == null) {
			respuesta.setCodigo("404");
			respuesta.setMensaje("No se encontraron las direcciones");
		} else {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Se listaron las direcciones");
		}
		return respuesta;

	}

	@GetMapping("listarDireccionesPorId/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<MasterCatalogo> listarDireccionesPorId(@PathVariable("id") Integer id) {
		Log.info("listarDireccionesPorId");
		MensajePersonalizado<MasterCatalogo> respuesta = new MensajePersonalizado<>();
		respuesta.setRespuesta(gestorDireccionesService.listarDireccionesPorId(id));
		if (respuesta.getRespuesta() == null) {
			respuesta.setCodigo("404");
			respuesta.setMensaje("No se encontraron las direcciones");
		} else {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Se encontro la direcciones");
		}
		return respuesta;
	}

	@PutMapping("actualizarDirecciones/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<MasterCatalogo> actualizarDirecciones(@PathVariable("id") Integer id, @RequestBody PeticionCatalogoDireccion peticion){
		Log.info("actualizarDirecciones");
		MensajePersonalizado<MasterCatalogo> respuesta = new MensajePersonalizado<>();
		respuesta.setRespuesta(gestorDireccionesService.actualizarDirecciones(id, peticion));
		if (respuesta.getRespuesta() == null) {
			respuesta.setCodigo("404");
			respuesta.setMensaje("No se actualizo la direccion");
		}
		else {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Se actualizo la direccion");
		}
		return respuesta;
	}

	@PutMapping("eliminarDireccion/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<MasterCatalogo> eliminarDirecciones(@PathVariable("id") Integer id){
		Log.info("eliminarDirecciones");
		MensajePersonalizado<MasterCatalogo> respuesta = new MensajePersonalizado<>();
		respuesta.setRespuesta(gestorDireccionesService.eliminarDirecciones(id));
		if (respuesta.getRespuesta() == null) {
			respuesta.setCodigo("404");
			respuesta.setMensaje("No se elimino la direccion");
		}
		else {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Se elimino la direccion");
		}
		return respuesta;
	}
}
