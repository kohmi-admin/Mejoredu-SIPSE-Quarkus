package mx.sep.dgtic.sipse.presupuestal.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionArbolVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaArbolVO;
import mx.sep.dgtic.sipse.presupuestal.service.ArbolProblemaService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/arbol-problema")
public class ArbolProblemaController {
  @Inject
  private ArbolProblemaService arbolProblemaService;

  @GetMapping("/consultaPorAnhio/{idAnhio}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(summary = "Consultar el arbol de problemas por anhio")
  @APIResponses(value = {
          @APIResponse(responseCode = "200",
                  description = "OK",
                  content = {@Content(
                          example = "{\"codigo\":\"200\",\"mensaje\":\"Exitoso\",\"respuesta\":{\"idArbol\":1,\"idAnhio\":2023,\"problemaCentral\":\"string\",\"causas\":[{\"idNodo\":38,\"nivel\":1,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[]}],\"efectos\":[{\"idNodo\":39,\"nivel\":1,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[{\"idNodo\":40,\"nivel\":2,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[{\"idNodo\":41,\"nivel\":3,\"clave\":\"prueba\",\"descripcion\":\"string\",\"hijos\":[]}]}]}],\"fechaCreacion\":\"2023-11-22T16:11:05\"}}",
                          mediaType = MediaType.APPLICATION_JSON
                  )}),
  })
  public MensajePersonalizado<RespuestaArbolVO> consultaPorAnhio(@PathVariable int idAnhio) {
    Log.debug("Iniciando consultaPorAnhio");
    Log.debug("consultaPorAnhio por : " + idAnhio);

    var arbolProblema = arbolProblemaService.consultarPorAnhio(idAnhio);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", arbolProblema);

    Log.debug("Termina consultaPorAnhio");

    return respuesta;
  }

  @GetMapping("/consultaPorProgramaPresupuestal/{idProgramaPresupuestal}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(summary = "Consultar el arbol de problemas por programa presupuestal")
  @APIResponses(value = {
          @APIResponse(responseCode = "200",
                  description = "OK",
                  content = {@Content(
                          example = "{\"codigo\":\"200\",\"mensaje\":\"Exitoso\",\"respuesta\":{\"idArbol\":1,\"idAnhio\":2023,\"problemaCentral\":\"string\",\"causas\":[{\"idNodo\":38,\"nivel\":1,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[]}],\"efectos\":[{\"idNodo\":39,\"nivel\":1,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[{\"idNodo\":40,\"nivel\":2,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[{\"idNodo\":41,\"nivel\":3,\"clave\":\"prueba\",\"descripcion\":\"string\",\"hijos\":[]}]}]}],\"fechaCreacion\":\"2023-11-22T16:11:05\"}}",
                          mediaType = MediaType.APPLICATION_JSON
                  )}),
  })
  public MensajePersonalizado<RespuestaArbolVO> consultaPorProgramaPresupuestal(@PathVariable int idProgramaPresupuestal) {
    Log.debug("Iniciando consultaPorProgramaPresupuestal");
    Log.debug("consultaPorProgramaPresupuestal por : " + idProgramaPresupuestal);

    var arbolProblema = arbolProblemaService.consultarPorProgramaPresupuestal(idProgramaPresupuestal);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", arbolProblema);

    Log.debug("Termina consultaPorProgramaPresupuestal");

    return respuesta;
  }

  @GetMapping("/consultaPorId/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(summary = "Consultar el arbol de problemas por id")
  @APIResponses(value = {
          @APIResponse(responseCode = "200",
                  description = "OK",
                  content = {@Content(
                          example = "{\"codigo\":\"200\",\"mensaje\":\"Exitoso\",\"respuesta\":{\"idArbol\":1,\"idAnhio\":2023,\"problemaCentral\":\"string\",\"causas\":[{\"idNodo\":38,\"nivel\":1,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[]}],\"efectos\":[{\"idNodo\":39,\"nivel\":1,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[{\"idNodo\":40,\"nivel\":2,\"clave\":\"string\",\"descripcion\":\"string\",\"hijos\":[{\"idNodo\":41,\"nivel\":3,\"clave\":\"prueba\",\"descripcion\":\"string\",\"hijos\":[]}]}]}],\"fechaCreacion\":\"2023-11-22T16:11:05\"}}",
                          mediaType = MediaType.APPLICATION_JSON
                  )}),
  })
  public MensajePersonalizado<RespuestaArbolVO> consultaPorId(@PathVariable int id) {
    Log.debug("Iniciando consultaPorId");
    Log.debug("consultaPorId por : " + id);

    var arbolProblema = arbolProblemaService.consultarPorId(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", arbolProblema);

    Log.debug("Termina consultaPorId");

    return respuesta;
  }

  @PostMapping("/registrar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica registrar(@RequestBody PeticionArbolVO arbolProblema) {
    Log.debug("Iniciando registrar");
    Log.debug("registrar por : " + arbolProblema);

    arbolProblemaService.registrar(arbolProblema);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina registrar");

    return respuesta;
  }
}
