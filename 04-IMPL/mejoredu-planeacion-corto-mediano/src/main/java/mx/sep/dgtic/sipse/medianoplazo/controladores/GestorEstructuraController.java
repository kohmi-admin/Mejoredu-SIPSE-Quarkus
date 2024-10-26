package mx.sep.dgtic.sipse.medianoplazo.controladores;

import java.util.List;

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
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.InicioDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionInicioDTO;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IEstructuraService;

@RestController
@RequestMapping("api/medianoplazo")
public class GestorEstructuraController {
	
	@Inject
	IEstructuraService estructuraService;
	
	@GetMapping("version")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<String> getVersion() {
		MensajePersonalizado<String> respusta = new MensajePersonalizado<String>();
		respusta.setCodigo("200");
		respusta.setMensaje("Exitoso");
		respusta.setRespuesta("20231023");
		return respusta;
	}
	
	@GetMapping("consultarInicioPorAnhio/{anhio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<InicioDTO> consultarInicioPorAnhio(@PathVariable("anhio") Integer anhio) {
		Log.info("Iniciando consultaPorID :" + anhio);
		MensajePersonalizado<InicioDTO> respusta = estructuraService.consultarEstructuraPorAnhio(anhio);

		Log.info("Termina consultaPorID.");
		return respusta;
	}
	
	@GetMapping("consultarInicioPorAnhioPorValidar/{anhio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<InicioDTO>> consultarInicioPorAnhioPorValidar(@PathVariable("anhio") Integer anhio)  {
			Log.info("Arrancando consulta todos consultarTodosInicio");
			MensajePersonalizado<List<InicioDTO>> respusta = estructuraService.consultarEstructuraActivos();

			Log.info("Termina consulta todos consultarTodosInicio");
					
			return respusta;
		}
	
	@GetMapping("consultarInicioPorID/{idInicio}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<InicioDTO> consultarInicioPorID(@PathVariable("idInicio") Integer idInicio) {
		Log.info("Iniciando consultaPorID :" + idInicio);
		MensajePersonalizado<InicioDTO> respusta = estructuraService.consultarEstructuraPorID(idInicio);

		Log.info("Termina consultaPorID.");
		return respusta;
	}
	
	@GetMapping("consultarTodosInicio")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public MensajePersonalizado<List<InicioDTO>> consultarTodosInicio() {
		Log.info("Arrancando consulta todos consultarTodosInicio");
		MensajePersonalizado<List<InicioDTO>> respusta = estructuraService.consultarEstructuraActivos();

		Log.info("Termina consulta todos consultarTodosInicio");
				
		return respusta;
	}
	
	@PostMapping("registrar")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public RespuestaGenerica registrar(@RequestBody PeticionInicioDTO peticion) {
		
		RespuestaGenerica respuesta = estructuraService.registrar(peticion);
		return respuesta ;
	}
	
	@PutMapping("modificar/{idEstructura}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	
	public RespuestaGenerica modificar(@RequestBody PeticionInicioDTO peticion, @PathVariable Integer idEstructura) {
		RespuestaGenerica respuesta = estructuraService.modificar(peticion, idEstructura);
		return respuesta ;
	}
	
	@PutMapping("eliminar/{idEstructura}/{cveUsuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica eliminar(@PathVariable Integer idEstructura, @PathVariable String cveUsuario) {
		RespuestaGenerica respuesta = estructuraService.eliminar(idEstructura, cveUsuario);
		return respuesta ;
	}
	
	@PutMapping("finalizarRegistro/{idEstructura}/{cveUsuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica finalizarRegistro(@PathVariable Integer idEstructura, @PathVariable String cveUsuario) {
		RespuestaGenerica respuesta = estructuraService.finalizarRegistro(idEstructura, cveUsuario);
		return respuesta ;
	}
	
	@PutMapping("enviarARevisar/{idEstructura}/{cveUsuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica enviarARevisar(@PathVariable Integer idEstructura, @PathVariable String cveUsuario) {
		RespuestaGenerica respuesta = estructuraService.enviarRevision(idEstructura, cveUsuario);
		return respuesta ;
	}
	
	@PutMapping("enviarAValidacionTectica/{idEstructura}/{cveUsuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica enviarAValidacionTectica(@PathVariable Integer idEstructura, @PathVariable String cveUsuario) {
		RespuestaGenerica respuesta = estructuraService.enviarValidacionTecnica(idEstructura, cveUsuario);
		return respuesta ;
	}
	@PutMapping("registroAprobado/{idEstructura}/{cveUsuario}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public RespuestaGenerica registroAprobado(@PathVariable Integer idEstructura, @PathVariable String cveUsuario) {
		RespuestaGenerica respuesta = estructuraService.registroAprobado(idEstructura, cveUsuario);
		return respuesta ;
	}

}
