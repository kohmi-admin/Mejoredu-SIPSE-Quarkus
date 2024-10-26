package mx.edu.sep.dgtic.mejoredu.catalogos.controladores;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.servicios.GestorUnidadService;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import org.springframework.web.bind.annotation.*;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.RespuestaCatalogo;

@RestController
@RequestMapping("api/unidades")
public class UnidadesController {


	private static final Integer PADRE_UNIDAD_ADMINISTRATIVA = 2059;
	@Inject
	GestorUnidadService gestorUnidadService;
	
	@GetMapping("/consultarActivos")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarActivos() {
		Log.info("Arrancando endpoint Uniades consultarActivos");

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

		respuestaCat.setCatalogo(gestorUnidadService.consultarActivos(PADRE_UNIDAD_ADMINISTRATIVA));

		Log.info("Terminando endpoint Uniades consultarActivos");

		return respuestaCat;
	}
	@GetMapping("/consultarUnidadPorID/{idOpcion}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaCatalogo consultarUnidadPorID(@PathVariable("idOpcion") int idOpcion) {
		Log.info("Arrancando endpoint consultarUnidadPorID");
		Log.info("Parametro de entra : " + idOpcion);

		RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

		List<MasterCatalogoDto> catalogos = gestorUnidadService.consultarOpcionADTO(idOpcion);
		if (catalogos == null) {
			respuestaCat = new RespuestaCatalogo("404", "Opcion no encontrada");
		}
		respuestaCat.setCatalogo(catalogos);

		Log.info("Terminando endpoint consultarUnidadPorID");
		return respuestaCat;

	}

	@PostMapping("/agregarUnidad")
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<MasterCatalogo> guardarUnidad(@RequestBody PeticionCatalogo peticion) {
		MensajePersonalizado<MasterCatalogo> respuesta = new MensajePersonalizado<>();
		respuesta.setMensaje("Se guardo con exito");
		respuesta.setCodigo("200");
		respuesta.setRespuesta(gestorUnidadService.guardarUnidad(peticion));
		return respuesta;
	}
	@PutMapping("/actualizarUnidad/{idUnidad}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica actualizarUnidad(@RequestParam("idUnidad") int idUnidad,@RequestBody PeticionCatalogo peticion) {
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Se actualizó con éxito");
		gestorUnidadService.actualizarUnidad(peticion,idUnidad);

		return respuesta;
	}
	@PutMapping("/eliminarUnidad/{idUnidad}")
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminarUnidad(@PathVariable("idUnidad") int idUnidad) {
		RespuestaGenerica respuesta = new RespuestaGenerica("200", "Se elimino con éxito");
		gestorUnidadService.eliminarUnidad(idUnidad);

		return respuesta;
	}

}
