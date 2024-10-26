package mx.sep.dgtic.sipse.presupuestal.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionDiagnosticoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaDiagnosticoVO;
import mx.sep.dgtic.sipse.presupuestal.dao.DiagnosticoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ProgramaPresupuestalRepository;
import mx.sep.dgtic.sipse.presupuestal.entity.Diagnostico;
import mx.sep.dgtic.sipse.presupuestal.service.DiagnosticoService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.springframework.stereotype.Service;

@Service
public class DiagnosticoServiceImpl implements DiagnosticoService {
  @ConfigProperty(name = "programa_presupuestal.p016")
  private Integer ID_P016;
  @Inject
  private DiagnosticoRepository diagnosticoRepository;
  @Inject
  private ProgramaPresupuestalRepository programaPresupuestalRepository;

  @Override
  public RespuestaDiagnosticoVO consultarPorAnho(int anho) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(anho, ID_P016).orElseThrow(() -> new NotFoundException("No se encontró el programa presupuestal del año: " + anho));
    var diagnostico = diagnosticoRepository.findByIdPrograma(programa.getIdPresupuestal()).orElseGet(() -> {
      var nuevoDiagnostico = new Diagnostico();
      nuevoDiagnostico.setIdPresupuestal(programa.getIdPresupuestal());
      return nuevoDiagnostico;
    });

    var vo = new RespuestaDiagnosticoVO();

    vo.setIdDiagnostico(diagnostico.getIdDiagnostico());
    vo.setAnho(anho);
    vo.setAntecedentes(diagnostico.getCxAntecedentes());
    vo.setDefinicionProblema(diagnostico.getCxDefinicionProblema());
    vo.setEstadoProblema(diagnostico.getCxEstadoProblema());
    vo.setEvolucionProblema(diagnostico.getCxEvolucionProblema());
    vo.setCobertura(diagnostico.getCxCobertura());
    vo.setIdentificacionPoblacionPotencial(diagnostico.getCxIdentificacionPoblacionPotencial());
    vo.setIdentificacionPoblacionObjetivo(diagnostico.getCxIdentificacionPoblacionObjetivo());
    vo.setCuantificacionPoblacionObjetivo(diagnostico.getCxCuantificacionPoblacionObjetivo());
    vo.setFrecuenciaActualizacionPoblacion(diagnostico.getCxFrecuenciaActualizacionPotencialObjetivo());
    vo.setAnalisisAlternativas(diagnostico.getCxAnalisisAlternativas());
    vo.setCveUsuario(programa.getCveUsuario());

    return vo;
  }

  @Override
  public RespuestaDiagnosticoVO consultarPorProgramaPresupuestal(int id) {
    var programa = programaPresupuestalRepository.findByIdOptional(id).orElseThrow(() -> {
      throw new NotFoundException("No se encontró el programa presupuestal con id: " + id);
    });
    var diagnostico = diagnosticoRepository.findByIdPrograma(programa.getIdPresupuestal()).orElseGet(() -> {
      var nuevoDiagnostico = new Diagnostico();
      nuevoDiagnostico.setIdPresupuestal(programa.getIdPresupuestal());
      return nuevoDiagnostico;
    });

    var vo = new RespuestaDiagnosticoVO();

    vo.setIdDiagnostico(id);
    vo.setAnho(programa.getIdAnhio());
    vo.setAntecedentes(diagnostico.getCxAntecedentes());
    vo.setDefinicionProblema(diagnostico.getCxDefinicionProblema());
    vo.setEstadoProblema(diagnostico.getCxEstadoProblema());
    vo.setEvolucionProblema(diagnostico.getCxEvolucionProblema());
    vo.setCobertura(diagnostico.getCxCobertura());
    vo.setIdentificacionPoblacionPotencial(diagnostico.getCxIdentificacionPoblacionPotencial());
    vo.setIdentificacionPoblacionObjetivo(diagnostico.getCxIdentificacionPoblacionObjetivo());
    vo.setCuantificacionPoblacionObjetivo(diagnostico.getCxCuantificacionPoblacionObjetivo());
    vo.setFrecuenciaActualizacionPoblacion(diagnostico.getCxFrecuenciaActualizacionPotencialObjetivo());
    vo.setAnalisisAlternativas(diagnostico.getCxAnalisisAlternativas());
    vo.setCveUsuario(programa.getCveUsuario());

    return vo;
  }

  @Override
  public RespuestaDiagnosticoVO consultarPorId(int id) {
    var diagnostico = diagnosticoRepository.findByIdOptional(id).orElseThrow(() -> {
      throw new NotFoundException("No se encontró el programa presupuestal con id: " + id);
    });

    var vo = new RespuestaDiagnosticoVO();

    vo.setIdDiagnostico(id);
    vo.setAnho(diagnostico.getProgramaPresupuestal().getIdAnhio());
    vo.setAntecedentes(diagnostico.getCxAntecedentes());
    vo.setDefinicionProblema(diagnostico.getCxDefinicionProblema());
    vo.setEstadoProblema(diagnostico.getCxEstadoProblema());
    vo.setEvolucionProblema(diagnostico.getCxEvolucionProblema());
    vo.setCobertura(diagnostico.getCxCobertura());
    vo.setIdentificacionPoblacionPotencial(diagnostico.getCxIdentificacionPoblacionPotencial());
    vo.setIdentificacionPoblacionObjetivo(diagnostico.getCxIdentificacionPoblacionObjetivo());
    vo.setCuantificacionPoblacionObjetivo(diagnostico.getCxCuantificacionPoblacionObjetivo());
    vo.setFrecuenciaActualizacionPoblacion(diagnostico.getCxFrecuenciaActualizacionPotencialObjetivo());
    vo.setAnalisisAlternativas(diagnostico.getCxAnalisisAlternativas());
    vo.setCveUsuario(diagnostico.getProgramaPresupuestal().getCveUsuario());

    return vo;
  }

  @Override
  @Transactional
  public void registrar(PeticionDiagnosticoVO diagnosticoPeticion) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(diagnosticoPeticion.getAnho(), ID_P016).orElseThrow(() -> {
      throw new NotFoundException("No se encontró el programa presupuestal del año: " + diagnosticoPeticion.getAnho() + ". Es necesario registrar primero los datos generales.");
    });
    var diagnostico = diagnosticoRepository.findByIdPrograma(programa.getIdPresupuestal()).orElseGet(() -> {
      var nuevoDiagnostico = new Diagnostico();
      nuevoDiagnostico.setIdPresupuestal(programa.getIdPresupuestal());
      return nuevoDiagnostico;
    });

    programa.setCveUsuario(diagnosticoPeticion.getCveUsuario());
    programaPresupuestalRepository.persist(programa);

    diagnostico.setCxAntecedentes(diagnosticoPeticion.getAntecedentes());
    diagnostico.setCxDefinicionProblema(diagnosticoPeticion.getDefinicionProblema());
    diagnostico.setCxEstadoProblema(diagnosticoPeticion.getEstadoProblema());
    diagnostico.setCxEvolucionProblema(diagnosticoPeticion.getEvolucionProblema());
    diagnostico.setCxCobertura(diagnosticoPeticion.getCobertura());
    diagnostico.setCxIdentificacionPoblacionPotencial(diagnosticoPeticion.getIdentificacionPoblacionPotencial());
    diagnostico.setCxIdentificacionPoblacionObjetivo(diagnosticoPeticion.getIdentificacionPoblacionObjetivo());
    diagnostico.setCxCuantificacionPoblacionObjetivo(diagnosticoPeticion.getCuantificacionPoblacionObjetivo());
    diagnostico.setCxFrecuenciaActualizacionPotencialObjetivo(diagnosticoPeticion.getFrecuenciaActualizacionPoblacion());
    diagnostico.setCxAnalisisAlternativas(diagnosticoPeticion.getAnalisisAlternativas());

    diagnosticoRepository.persist(diagnostico);
  }
}
