package mx.sep.dgtic.sipse.presupuestal.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.RespuestaCatalogo;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionFichasIndicadoresVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.PeticionMatrizIndicadoresResultados;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.RespuestaMatrizIndicadoresResultados;
import mx.sep.dgtic.sipse.presupuestal.service.MatrizIndicadoresResultadosService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mir")
public class MatrizIndicadorPresupuestalController {
  @Inject
  private MatrizIndicadoresResultadosService mirService;

  @GetMapping("/consultarCatalogoIndicadores/{anhio}")
  public RespuestaCatalogo consultarCatalogoIndicadoresPI(@PathVariable int anhio) {
    Log.info("Arrancando endpoint consultarOpcionCatalogoADto");

    RespuestaCatalogo respuestaCat = new RespuestaCatalogo("200", "Exitoso");

    var catalogos = mirService.consultarCatalogoIndicadoresPI(anhio);

    respuestaCat.setCatalogo(catalogos);

    Log.info("Terminando endpoint consultarOpcionCatalogoADto");
    return respuestaCat;
  }

  @GetMapping("/consultaPorAnhio/{anhio}")
  public MensajePersonalizado<RespuestaMatrizIndicadoresResultados> consultarMIRPorAnhio(@PathVariable int anhio) {
    var matrizResultados = mirService.consultaPorAnhio(anhio);
    return new MensajePersonalizado<>("200", "Exitoso", matrizResultados);
  }

  @GetMapping("/consultaPorId/{idMir}")
  public MensajePersonalizado<RespuestaMatrizIndicadoresResultados> consultarMIR(@PathVariable int idMir) {
    var matrizResultados = mirService.consultaPorId(idMir);
    return new MensajePersonalizado<>("200", "Exitoso", matrizResultados);
  }

  @PostMapping("/registrar")
  public RespuestaGenerica registrarMIR(@RequestBody PeticionMatrizIndicadoresResultados peticion) {
    Log.info("Inicio de registro de matriz de indicadores de resultados");
    Log.info("Matriz de indicadores de resultados: " + peticion.getIdAnhio());
    mirService.registrar(peticion);
    Log.info("Fin de registro de matriz de indicadores de resultados");
    return new RespuestaGenerica("200", "Exitoso");
  }

  @GetMapping("/{idIndicador}/consultar-ficha")
  public MensajePersonalizado<PeticionFichasIndicadoresVO> consultarFichaIndicador(@PathVariable int idIndicador) {
    var matrizResultados = mirService.consultarFicha(idIndicador);
    return new MensajePersonalizado<>("200", "Exitoso", matrizResultados);
  }

  @PostMapping("/{idIndicador}/registrar-ficha")
  public RespuestaGenerica registrarFichaIndicador(@PathVariable int idIndicador, @RequestBody PeticionFichasIndicadoresVO peticion) {
    mirService.registrarFicha(idIndicador, peticion);
    return new RespuestaGenerica("200", "Exitoso");
  }
}
