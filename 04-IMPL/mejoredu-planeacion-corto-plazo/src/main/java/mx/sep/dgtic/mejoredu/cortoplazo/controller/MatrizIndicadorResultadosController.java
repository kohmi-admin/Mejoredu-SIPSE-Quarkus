package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.IndicadorResultadoCortoPlazo;
import mx.sep.dgtic.mejoredu.cortoplazo.ProductoMirVO;
import mx.sep.dgtic.mejoredu.cortoplazo.service.MatrizIndicadorResultadosService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mir")
public class MatrizIndicadorResultadosController {
  @Inject
  private MatrizIndicadorResultadosService matrizIndicadorResultadosService;

  @GetMapping("/consultaTablaMirPorAnhio/{idAnhio}/{cveUsuario}")
  public MensajePersonalizado<List<IndicadorResultadoCortoPlazo>> consultaTablaMir(@PathVariable int idAnhio, @PathVariable String cveUsuario) {
    Log.info("Iniciando consultaTablaMir");
    Log.info("consultaTablaMir por: " + idAnhio);

    var matriz = matrizIndicadorResultadosService.consultaTablaMirPorAnhio(idAnhio, cveUsuario);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", matriz);

    Log.info("Termina consultaTablaMir");

    return respuesta;
  }

  @GetMapping("/consultarProductosPorIdAnhio/{idAnhio}/{cveUsuario}")
  public MensajePersonalizado<List<ProductoMirVO>> consultarProductosPorIdMir(@PathVariable int idAnhio, @PathVariable String cveUsuario) {
    Log.info("Iniciando consultarProductosPorIdMir");
    Log.info("consultarProductosPorIdMir por: " + idAnhio);

    var matriz = matrizIndicadorResultadosService.consultarProductosPorAnhio(idAnhio, cveUsuario);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", matriz);

    Log.info("Termina consultarProductosPorIdMir");

    return respuesta;
  }
}
