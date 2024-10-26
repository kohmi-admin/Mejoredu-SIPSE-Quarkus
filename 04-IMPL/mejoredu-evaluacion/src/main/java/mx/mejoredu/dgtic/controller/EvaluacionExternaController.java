package mx.mejoredu.dgtic.controller;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroAspectosSusceptiblesVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroInformeEvaluacionExternaVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaAspectosSusceptiblesVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaInformeEvaluacionExternaVO;
import mx.mejoredu.dgtic.service.EvaluacionExternaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluacionExterna")
public class EvaluacionExternaController {
  @Inject
  private EvaluacionExternaService evaluacionExternaService;

  @GetMapping("/informes/consultar")
  public MensajePersonalizado<List<RespuestaInformeEvaluacionExternaVO>> consultarEvaluacionExterna(
      @RequestParam Integer anio
  ) {
    var informes = evaluacionExternaService.consultarInformesEvaluacionExterna(anio);
    return new MensajePersonalizado<>("200", "Exitoso", informes);
  }

  @PostMapping("/informes/registrar")
  public RespuestaGenerica registrarEvaluacionExterna(
      @RequestBody PeticionRegistroInformeEvaluacionExternaVO peticion
  ) {
    evaluacionExternaService.registrarInformeEvaluacionExterna(peticion);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @PutMapping("/informes/{id}/eliminar")
  public RespuestaGenerica eliminarInformeEvaluacionExterna(
      @PathVariable Long id
  ) {
    evaluacionExternaService.eliminarInformeEvaluacionExterna(id);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @GetMapping("/aspectos-mejorables/consultar")
  public MensajePersonalizado<List<RespuestaAspectosSusceptiblesVO>> consultarAspectosMejorablesEvaluacionExterna(
      @RequestParam Integer anio
  ) {
    var aspectos = evaluacionExternaService.consultarAspectosSusceptibles(anio);
    return new MensajePersonalizado<>("200", "Exitoso", aspectos);
  }

  @PostMapping("/aspectos-mejorables/registrar")
  public RespuestaGenerica registrarAspectosMejorablesEvaluacionExterna(
      @RequestBody PeticionRegistroAspectosSusceptiblesVO peticion
  ) {
    evaluacionExternaService.registrarAspectosSusceptibles(peticion);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @PutMapping("/aspectos-mejorables/{id}/eliminar")
  public RespuestaGenerica eliminarAspectosMejorablesEvaluacionExterna(
      @PathVariable Long id
  ) {
    evaluacionExternaService.eliminarAspectosSusceptibles(id);
    return new RespuestaGenerica("200", "Exitoso");
  }
}
