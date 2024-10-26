package mx.sep.dgtic.sipse.presupuestal.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionM001VO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaM001VO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaProgramaPresupuestalVO;
import mx.sep.dgtic.sipse.presupuestal.service.ProgramasPresupuestalesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programas-presupuestales")
public class ProgramasPresupuestalesController {
  @Inject
  private ProgramasPresupuestalesService programasPresupuestalesService;

  @GetMapping("/consultaPorAnhio/{anhio}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<RespuestaProgramaPresupuestalVO>> consultaPorAnhio(@PathVariable int anhio,
                                                                                      @RequestParam("consultarArchivos") boolean consultarArchivos) {
    Log.debug("Iniciando consultaPorAnhio");
    Log.debug("consultaProyectosPorAnhio por : " + anhio);
    Log.debug("consultarArchivos : " + consultarArchivos);

    var programas = programasPresupuestalesService.consultaPorAnhio(anhio, consultarArchivos);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", programas);

    Log.debug("Termina consultaPorAnhio");

    return respuesta;
  }

  @GetMapping("/consultaPorId/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaProgramaPresupuestalVO> consultaPorId(@PathVariable int id) {
    Log.debug("Iniciando consultaPorId");
    Log.debug("consultaPorId por : " + id);

    var programa = programasPresupuestalesService.consultaPorId(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", programa);

    Log.debug("Termina consultaPorId");

    return respuesta;
  }

  @GetMapping("/consultaPorId/M001/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaM001VO> consultaPorIdM001(@PathVariable int id) {
    Log.debug("Iniciando consultaPorIdM001");
    Log.debug("consultaPorIdM001 por : " + id);

    var programa = programasPresupuestalesService.consultaPorIdM001(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", programa);

    Log.debug("Termina consultaPorIdM001");

    return respuesta;
  }
  @GetMapping("/consultaPorAnhio/M001/{anhio}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaM001VO> consultaPorAnhioM001(@PathVariable int anhio) {
    Log.debug("Iniciando consultaPorIdM001");
    Log.debug("consultaPorIdM001 por : " + anhio);

    var programa = programasPresupuestalesService.consultarM001PorAnhio(anhio);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", programa);

    Log.debug("Termina consultaPorIdM001");

    return respuesta;
  }

  @GetMapping("/consultaPorId/O001/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaM001VO> consultaPorIdO001(@PathVariable int id) {
    Log.debug("Iniciando consultaPorIdO001");
    Log.debug("consultaPorIdO001 por : " + id);

    var programa = programasPresupuestalesService.consultaPorIdO001(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", programa);

    Log.debug("Termina consultaPorIdO001");

    return respuesta;
  }

  @GetMapping("/consultaPorAnhio/O001/{anhio}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaM001VO> consultaPorAnhioO001(@PathVariable int anhio) {
    Log.debug("Iniciando consultaPorIdM001");
    Log.debug("consultaPorIdM001 por : " + anhio);

    var programa = programasPresupuestalesService.consultarO001PorAnhio(anhio);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", programa);

    Log.debug("Termina consultaPorIdM001");

    return respuesta;
  }

  @PostMapping("/registrar/m001")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica registrarM001(@RequestBody PeticionM001VO programa) {
    Log.debug("Iniciando registrarM001");
    Log.debug("registrarM001 por: " + programa);

    programasPresupuestalesService.registrarM001(programa);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina registrarM001");

    return respuesta;
  }

  @PostMapping("/registrar/o001")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica registrarO001(@RequestBody PeticionM001VO programa) {
    Log.debug("Iniciando registrarO001");
    Log.debug("registrarO002 por: " + programa);

    programasPresupuestalesService.registrarO001(programa);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina registrarO001");

    return respuesta;
  }

  @PutMapping("/eliminar/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica eliminar(@PathVariable int id) {
    Log.debug("Iniciando eliminar");
    Log.debug("eliminar por : " + id);

    programasPresupuestalesService.eliminar(id);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina eliminar");

    return respuesta;
  }
  @PutMapping("/finalizarRegistro")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica finalizarRegistro(PeticionPorID peticion) {
    Log.debug("Iniciando finalizarRegistro");
    Log.debug("Peticion: " + peticion.getId());
    programasPresupuestalesService.finalizarRegistro(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");
    Log.debug("Terminando finalizarRegistro");
    return respuesta;
  }
  @PutMapping("/enviarARevisar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica enviarARevisar(@RequestBody PeticionPorID peticion) {
    Log.debug("Iniciando enviarARevisar");
    Log.debug("Peticion: " + peticion.getId());
    programasPresupuestalesService.enviarRevision(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");
    Log.debug("Terminando enviarARevisar");
    return respuesta;
  }
  @PutMapping("/enviarAValidacionTecnica")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public RespuestaGenerica enviarAValidacionTecnica(@RequestBody PeticionPorID peticion) {
    Log.debug("Iniciando enviarAValidacionTecnica");
    Log.debug("Peticion: " + peticion.getId());
    programasPresupuestalesService.enviarValidacionTecnica(peticion);
    var respuesta = new RespuestaGenerica("200", "Exitoso");
    Log.debug("Terminando enviarAValidacionTecnica");
    return respuesta;
  }
}
