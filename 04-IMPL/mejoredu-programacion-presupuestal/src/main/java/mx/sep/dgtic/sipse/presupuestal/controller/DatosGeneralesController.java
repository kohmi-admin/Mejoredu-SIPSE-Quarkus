package mx.sep.dgtic.sipse.presupuestal.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionDatosGeneralesVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaDatosGeneralesVO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.sipse.presupuestal.service.DatosGeneralesService;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/datos-generales")
public class DatosGeneralesController {
  @Inject
  private DatosGeneralesService datosGeneralesService;

  @GetMapping("/consultaPorAnho/{anho}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaDatosGeneralesVO> consultaPorAnho(@PathVariable int anho) {
    Log.debug("Iniciando consultaPorAnho");
    Log.debug("consultaPorAnho por : " + anho);

    var datosGenerales = datosGeneralesService.consultarPorAnho(anho);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", datosGenerales);

    Log.debug("Termina consultaPorAnho");

    return respuesta;
  }

  @GetMapping("/consultaPorProgramaPresupuestal/{idProgramaPresupuestal}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaDatosGeneralesVO> consultaPorProgramaPresupuestal(@PathVariable int idProgramaPresupuestal) {
    Log.debug("Iniciando consultaPorProgramaPresupuestal");
    Log.debug("consultaPorProgramaPresupuestal por : " + idProgramaPresupuestal);

    var datosGenerales = datosGeneralesService.consultarPorProgramaPresupuestal(idProgramaPresupuestal);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", datosGenerales);

    Log.debug("Termina consultaPorProgramaPresupuestal");

    return respuesta;
  }

  @GetMapping("/consultaPorId/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<RespuestaDatosGeneralesVO> consultaPorId(@PathVariable int id) {
    Log.debug("Iniciando consultaPorId");
    Log.debug("consultaPorId por : " + id);

    var datosGenerales = datosGeneralesService.consultarPorId(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", datosGenerales);

    Log.debug("Termina consultaPorId");

    return respuesta;
  }

  @GetMapping("/consultaArchivosPorId/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<ArchivoDTO>> consultaArchivosPorId(@PathVariable int id) {
    Log.debug("Iniciando consultaArchivosPorId");
    Log.debug("consultaArchivosPorId por : " + id);

    var archivos = datosGeneralesService.consultarArchivosPorId(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", archivos);

    Log.debug("Termina consultaArchivosPorId");

    return respuesta;
  }

  @PostMapping("/registrar")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(summary = "Registrar datos generales", description = """
    Registra los datos generales de un programa presupuestal.\r
    a) En caso de que el programa presupuestal para el año especificado no se encuentre registrado realiza el registro, de lo contrario lo actualiza.\r
    b) En caso de que los datos generales no hayan sido registrados crea el registro, de lo contrario lo actualiza.
    """)
  public RespuestaGenerica registrar(@RequestBody PeticionDatosGeneralesVO datosGenerales) {
    Log.debug("Iniciando registrar");
    Log.debug("registrar por : " + datosGenerales);

    datosGeneralesService.registrar(datosGenerales);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.debug("Termina registrar");

    return respuesta;
  }
}
