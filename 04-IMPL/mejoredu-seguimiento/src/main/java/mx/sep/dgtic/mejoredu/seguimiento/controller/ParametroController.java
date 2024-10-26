package mx.sep.dgtic.mejoredu.seguimiento.controller;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ElementoDTO;
import mx.sep.dgtic.mejoredu.seguimiento.service.ParametroService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mp/parametro")
public class ParametroController {
  @Inject
  private ParametroService parametroService;

  @GetMapping("consultarPorIdProyecto/{idProyecto}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public MensajePersonalizado<List<ElementoDTO>> consultarPorIdProyecto(@PathVariable Integer idProyecto) {
    Log.info("Iniciando consultarPorIdProyecto en Parametro");
    Log.info("consultarPorIdProyecto por : " + idProyecto);

    var parametros = parametroService.consultarPorIdProyecto(idProyecto);
    var respuesta = new MensajePersonalizado<>("200", "Exitoso", parametros);

    Log.info("Termina consultarPorIdProyecto en parametro");
    return respuesta;
  }
}
