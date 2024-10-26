package mx.mejoredu.dgtic.controller;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroEncuestaVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaEncuentaVO;
import mx.mejoredu.dgtic.service.EncuestasService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encuestas")
public class EncuestasController {
  @Inject
  private EncuestasService encuestasService;

  @GetMapping("/consultar")
  public MensajePersonalizado<List<RespuestaEncuentaVO>> consultarEncuestas(
      @RequestParam Integer anio
  ) {
    var encuestas = encuestasService.consultarEncuestas(anio);
    return new MensajePersonalizado<>("200", "Exitoso", encuestas);
  }

  @PostMapping("/registrar")
  public RespuestaGenerica registrarEncuestas(
      @RequestBody PeticionRegistroEncuestaVO peticion
  ) {
    encuestasService.registrarEncuesta(peticion);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @PutMapping("/{idEncuesta}/eliminar")
  public RespuestaGenerica eliminarEncuesta(
      @PathVariable Long idEncuesta
  ) {
    encuestasService.eliminarEncuesta(idEncuesta);
    return new RespuestaGenerica("200", "Exitoso");
  }
}
