package mx.sep.dgtic.sipse.presupuestal.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionDiagnosticoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaDiagnosticoVO;
import mx.sep.dgtic.sipse.presupuestal.service.DiagnosticoService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diagnostico")
public class DiagnosticoController {
  @Inject
  private DiagnosticoService diagnosticoService;

  @GetMapping("/consultaPorAnho/{anho}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaDiagnosticoVO> consultaPorAnho(@PathVariable int anho) {
    Log.debug("Iniciando consultaPorAnho");
    Log.debug("consultaPorAnho por : " + anho);

    var diagnostico = diagnosticoService.consultarPorAnho(anho);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", diagnostico);

    Log.debug("Termina consultaPorAnho");

    return respuesta;
  }

  @GetMapping("/consultaPorProgramaPresupuestal/{idProgramaPresupuestal}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaDiagnosticoVO> consultaPorProgramaPresupuestal(@PathVariable int idProgramaPresupuestal) {
    Log.debug("Iniciando consultaPorProgramaPresupuestal");
    Log.debug("consultaPorProgramaPresupuestal por : " + idProgramaPresupuestal);

    var diagnostico = diagnosticoService.consultarPorProgramaPresupuestal(idProgramaPresupuestal);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", diagnostico);

    Log.debug("Termina consultaPorProgramaPresupuestal");

    return respuesta;
  }

  @GetMapping("/consultaPorId/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaDiagnosticoVO> consultaPorId(@PathVariable int id) {
    Log.debug("Iniciando consultaPorId");
    Log.debug("consultaPorId por : " + id);

    var diagnostico = diagnosticoService.consultarPorId(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", diagnostico);

    Log.debug("Termina consultaPorId");

    return respuesta;
  }

  @PostMapping("/registrar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(summary = "Registrar datos generales", description = """
    Registra los datos del diagnostico de un programa presupuestal.\r
    a) En caso de que el programa presupuestal para el año especificado no se encuentre registrado realiza el registro, de lo contrario lo actualiza.\r
    b) En caso de que los datos generales no hayan sido registrados crea el registro, de lo contrario lo actualiza.
    """)
  public RespuestaGenerica registrar(@RequestBody PeticionDiagnosticoVO diagnostico) {
    Log.debug("Iniciando registrar");
    Log.debug("registrar por : " + diagnostico);

    diagnosticoService.registrar(diagnostico);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina registrar");

    return respuesta;
  }
}
