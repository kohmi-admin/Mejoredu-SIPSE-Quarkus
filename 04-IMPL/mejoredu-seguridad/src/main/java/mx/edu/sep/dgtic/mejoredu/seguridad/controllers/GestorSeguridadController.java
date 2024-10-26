package mx.edu.sep.dgtic.mejoredu.seguridad.controllers;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaError;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.ArchivadorService;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.GestorSeguridadService;
import mx.sep.dgtic.mejoredu.seguridad.PeticionAutenticar;
import mx.sep.dgtic.mejoredu.seguridad.RespuestaAutenticar;
import mx.sep.dgtic.mejoredu.seguridad.TipoUsuarioVO;
import mx.sep.dgtic.mejoredu.seguridad.archivador.ResponseAccesoAlfresco;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seguridad")
public class GestorSeguridadController {

  @Inject
  GestorSeguridadService gestorSeguridadService;

  @Inject
  ArchivadorService archivadorService;

  @GetMapping("/consultarTipoUsuarioPorNombre/{nombre}")
  @Produces(MediaType.APPLICATION_JSON)
  public TipoUsuarioVO consultarTipoUsuarioPorNombre(@PathVariable String nombre) {
    Log.info("Arrancando endpoint consultarTipoUsuarioPorNombre");
    Log.info("Parametro dee entra : " + nombre);

    Log.info("Terminando endpoint consultarTipoUsuarioPorNombre");
    return gestorSeguridadService.consultarTipoUsuarioPorNombre(nombre);
  }

  @GetMapping("/generarAccesoAlfresco")
  @Produces(MediaType.APPLICATION_JSON)
  public ResponseAccesoAlfresco generarAccesoAlfresco() {
    return archivadorService.geneAccesoAlfresco();
  }


  @PostMapping("/autenticarUsuario")
 
  @Operation(description = "Autentificar usuario")
  @APIResponses(value = {
    @APIResponse(responseCode = "200",
      description = "El usuario ha sido autentificado",
      content = {@Content(
        schema = @Schema(implementation = RespuestaAutenticar.class),
        mediaType = "application/json"
      )}),
    @APIResponse(responseCode = "400",
      description = "La contraseña provista no coincide",
      content = {@Content(
        schema = @Schema(implementation = RespuestaError.class),
        mediaType = "application/json"
      )}),
    @APIResponse(responseCode = "403",
      description = "El usuario provisto está deshabilitado",
      content = {@Content(
        schema = @Schema(implementation = RespuestaError.class),
        mediaType = "application/json"
      )}),
    @APIResponse(responseCode = "404",
      description = "El usuario provisto no existe",
      content = {@Content(
        schema = @Schema(implementation = RespuestaError.class),
        mediaType = "application/json"
      )})
  })
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaAutenticar autenticarUsuario(@RequestBody PeticionAutenticar autenticacion) throws Exception {
    Log.info("Arrancando endpoint autenticarUsuario");
    Log.info("Parametro dee entra cveUsuario  : " + autenticacion.getClave());
    Log.info("Parametro dee entra contrasenhia: " + autenticacion.getContrasenha());

    RespuestaAutenticar respuesta = new RespuestaAutenticar();
    Mensaje mensaje = new Mensaje("200", "Exitoso");
    /* PersonaVO personaVO = new PersonaVO(1, "Ernesto", "Martinez", "Espinosa", "erneme@hotmail.com", null);

    UsuarioVO usuarioVO = new UsuarioVO(autenticacion.getClave(), EstatusEnum.ACTIVO, "erneme@hotmail.com", null, TipoUsuarioEnum.ADMINISTRADOR, personaVO); */
    respuesta.setMensaje(mensaje);
    var usuarioVO = gestorSeguridadService.autenticarUsuario(autenticacion.getClave(), autenticacion.getContrasenha());
    respuesta.setDatosUsuario(usuarioVO);

    Log.info("Terminando endpoint autenticarUsuario");
    return respuesta;
  }

  @GetMapping("/consultarFirma")
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaAutenticar consultarFirma(
      @RequestParam String clave
  ) {
    Log.info("Arrancando endpoint consultarFirma");

    RespuestaAutenticar respuesta = new RespuestaAutenticar();
    Mensaje mensaje = new Mensaje("200", "Exitoso");
    respuesta.setMensaje(mensaje);
    respuesta.setDatosUsuario(gestorSeguridadService.consultarFirma(clave));

    Log.info("Terminando endpoint consultarFirma");

    return respuesta;
  }
}
