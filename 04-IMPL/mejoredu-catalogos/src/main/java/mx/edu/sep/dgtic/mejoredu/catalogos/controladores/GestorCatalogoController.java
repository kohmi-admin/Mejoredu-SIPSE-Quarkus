package mx.edu.sep.dgtic.mejoredu.catalogos.controladores;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.*;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import org.springframework.web.bind.annotation.*;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.catalogos.servicios.GestorCatalogoService;

@RestController
@RequestMapping("/api/catalogos")
public class GestorCatalogoController {

	@Inject
	GestorCatalogoService gestorCatalogoService;

	@GetMapping("/consultarOpcion/{idOpcion}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarOpcionCatalogoADto(@PathVariable("idOpcion") int idOpcion) {
		Log.info("Arrancando endpoint consultarOpcionCatalogoADto");
		Log.info("Parametro de entra : " + idOpcion);

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

		List<MasterCatalogoDto> catalogos = gestorCatalogoService.consultarOpcionADTO(idOpcion);

		respuestaCat.setCatalogo(catalogos);

		Log.info("Terminando endpoint consultarOpcionCatalogoADto");
		return respuestaCat;

	}

	@GetMapping("/consultarCatalogoID/{idCatalogo}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarCatalogoID(@PathVariable("idCatalogo") int idCatalogo) {
		Log.info("Arrancando endpoint consultarCatalogoID");
		Log.info("Parametro de entra : " + idCatalogo);

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");
		respuestaCat.setCatalogo(gestorCatalogoService.consultarCatalogoID(idCatalogo));
		if (respuestaCat.getCatalogo()== null) {
			respuestaCat = new RespuestaCatalogo("404", "No hay informacion");
		}

		Log.info("Terminando endpoint consultarCatalogoADTO");

		return respuestaCat;
	}
	@GetMapping("/consultarCatalogoPadres")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarCatalogosPadres() {
		Log.info("Arrancando endpoint consultarCatalogosPadres");

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

		respuestaCat.setCatalogo(gestorCatalogoService.consultarCatalogoPadres());

		Log.info("Terminando endpoint consultarCatalogoADTO");

		return respuestaCat;
	}
	@PostMapping("/agregarRegistroCatalogo")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado agregarRegistroCatalgo(@RequestBody PeticionRegistroCatalgos peticion) {
		MensajePersonalizado respuesta = new MensajePersonalizado<>();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Se guardo con exito");
		respuesta.setRespuesta(gestorCatalogoService.agregarRegistroCatalgo(peticion));

		return respuesta;
	}


	@PostMapping("/agregarCatalogo")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<MasterCatalogo> guardarCatalogo(@RequestBody PeticionCatalogo peticion) {
		MensajePersonalizado<MasterCatalogo> respuesta = new MensajePersonalizado<>();
		respuesta.setMensaje("Se guardo con exito");
		respuesta.setCodigo("200");
		respuesta.setRespuesta(gestorCatalogoService.guardarCatalogo(peticion));
		return respuesta;
	}

	@PutMapping("/actualizarCatalogo")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica actualizarCatalogo(@RequestParam("idCatalogo") int idCatalogo, @RequestBody PeticionCatalogo peticion) {
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Se actualizó con éxito");
		gestorCatalogoService.actualizarCatalogo(idCatalogo,peticion);

		return respuesta;
	}
	@PutMapping("/eliminarCatalogo/{idCatalogo}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminarCatalogo(@PathVariable("idCatalogo") int idCatalogo) {
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Se elimino con éxito");
		gestorCatalogoService.eliminarCatalogo(idCatalogo);

		return respuesta;
	}

//	@DeleteMapping
//	@Produces(MediaType.APPLICATION_JSON)
//	public RespuestaGenerica borrarCatalogo(@RequestBody PeticionCatalogo peticion) {
//		gestorCatalogoService.guardarCatalogo(peticion);
//		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Se eliminó con éxito");
//
//		gestorCatalogoService.guardarCatalogo(peticion);
//
//		return respuesta;
//	}

//	@GetMapping
//	public String version() {
//		return "DEV20230725";
//	}
}
