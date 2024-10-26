package mx.mejoredu.dgtic.controller;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.evaluacion.*;
import mx.mejoredu.dgtic.service.EvaluacionInternaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluacionInterna")
public class EvaluacionInternaController {
  @Inject
  private EvaluacionInternaService evaluacionInternaService;

  @GetMapping("/informe-autoevaluacion/consultar")
  public MensajePersonalizado<List<RespuestaInformeAutoevaluacionVO>> consultarEvaluacionInterna(
      @RequestParam Integer anhio,
      @RequestParam Integer trimestre
  ) {
    var informes = evaluacionInternaService.consultarInformesAutoevaluacion(anhio, trimestre);

    return new MensajePersonalizado<>("200", "Exitoso", informes);
  }

  @PostMapping("/informe-autoevaluacion/registrar")
  public RespuestaGenerica registrarEvaluacionInterna(
      @RequestBody PeticionRegistroInformeAutoevaluacionVO peticion
  ) {
    evaluacionInternaService.registrarInformeAutoevaluacion(peticion);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @PutMapping("/informe-autoevaluacion/{id}/eliminar")
  public RespuestaGenerica eliminarInformeAutoevaluacion(
      @PathVariable Long id
  ) {
    evaluacionInternaService.eliminarInformeAutoevaluacion(id);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @GetMapping("/evidencia-autoevaluacion/consultar")
  public MensajePersonalizado<List<RespuestaEvidenciaAutoevaluacionVO>> consultarEvidenciasEvaluacionInterna(
      @RequestParam Integer anhio,
      @RequestParam Integer trimestre
  ) {
    var evidencias = evaluacionInternaService.consultarEvidenciasAutoevaluacion(anhio, trimestre);

    return new MensajePersonalizado<>("200", "Exitoso", evidencias);
  }

  @PostMapping("/evidencia-autoevaluacion/registrar")
  public RespuestaGenerica registrarEvidenciasEvaluacionInterna(
      @RequestBody PeticionRegistroEvidenciaAutoevaluacionVO peticion
  ) {
    evaluacionInternaService.registrarEvidenciasAutoevaluacion(peticion);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @PutMapping("/evidencia-autoevaluacion/{id}/eliminar")
  public RespuestaGenerica eliminarEvidenciasEvaluacionInterna(
      @PathVariable Long id
  ) {
    evaluacionInternaService.eliminarEvidenciasAutoevaluacion(id);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @GetMapping("/desempenio/consultar")
  public MensajePersonalizado<List<RespuestaEvaluacionVO>> consultarDesempenioEvaluacionInterna(
      @RequestParam Integer anhio
  ) {
    var evaluaciones = evaluacionInternaService.consultarEvaluaciones(anhio);

    return new MensajePersonalizado<>("200", "Exitoso", evaluaciones);
  }

  @PostMapping("/desempenio/registrar")
  public RespuestaGenerica registrarDesempenioEvaluacionInterna(
      @RequestBody PeticionRegistroEvaluacionVO peticion
  ) {
    evaluacionInternaService.registrarEvaluacion(peticion);
    return new RespuestaGenerica("200", "Exitoso");
  }

  @PutMapping("/desempenio/{id}/eliminar")
  public RespuestaGenerica eliminarDesempenioEvaluacionInterna(
      @PathVariable Long id
  ) {
    evaluacionInternaService.eliminarEvaluacion(id);
    return new RespuestaGenerica("200", "Exitoso");
  }
}
