package mx.sep.dgtic.sipse.presupuestal.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionArbolObjetivoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaArbolObjetivoVO;
import mx.sep.dgtic.sipse.presupuestal.service.ArbolObjetivoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/arbol-objetivo")
public class ArbolObjetivoController {
  @Inject
  private ArbolObjetivoService arbolObjetivoService;

  @GetMapping("/consultaPorAnhio/{idAnhio}")
  public MensajePersonalizado<RespuestaArbolObjetivoVO> consultaPorAnhio(@PathVariable int idAnhio) {
    Log.info("Iniciando consultaPorAnhio");
    Log.info("consultaPorAnhio por : " + idAnhio);

    var arbolObjetivo = arbolObjetivoService.consultarPorAnhio(idAnhio);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", arbolObjetivo);

    Log.info("Termina consultaPorAnhio");

    return respuesta;
  }

  @GetMapping("/consultaPorProgramaPresupuestal/{idProgramaPresupuestal}")
  public MensajePersonalizado<RespuestaArbolObjetivoVO> consultaPorProgramaPresupuestal(@PathVariable int idProgramaPresupuestal) {
    Log.info("Iniciando consultaPorProgramaPresupuestal");
    Log.info("consultaPorProgramaPresupuestal por : " + idProgramaPresupuestal);

    var arbolObjetivo = arbolObjetivoService.consultarPorProgramaPresupuestal(idProgramaPresupuestal);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", arbolObjetivo);

    Log.info("Termina consultaPorProgramaPresupuestal");

    return respuesta;
  }

  @GetMapping("/consultaPorId/{id}")
  public MensajePersonalizado<RespuestaArbolObjetivoVO> consultaPorId(@PathVariable int id) {
    Log.info("Iniciando consultaPorId");
    Log.info("consultaPorId por : " + id);

    var arbolObjetivo = arbolObjetivoService.consultarPorId(id);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", arbolObjetivo);

    Log.info("Termina consultaPorId");

    return respuesta;
  }

  @PostMapping("/registrar")
  public RespuestaGenerica registrar(@RequestBody PeticionArbolObjetivoVO arbolObjetivo) {
    Log.info("Iniciando registrar");
    Log.info("registrar por : " + arbolObjetivo);

    arbolObjetivoService.registrar(arbolObjetivo);
    var respuesta = new RespuestaGenerica("200", "Exitoso");

    Log.info("Termina registrar");

    return respuesta;
  }
}
