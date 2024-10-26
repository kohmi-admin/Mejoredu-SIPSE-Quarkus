package mx.mejoredu.dgtic.service;

import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroAspectosSusceptiblesVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroInformeEvaluacionExternaVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaAspectosSusceptiblesVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaInformeEvaluacionExternaVO;

import java.util.List;

public interface EvaluacionExternaService {
  List<RespuestaInformeEvaluacionExternaVO> consultarInformesEvaluacionExterna(Integer anhio);
  void registrarInformeEvaluacionExterna(PeticionRegistroInformeEvaluacionExternaVO peticion);
  void eliminarInformeEvaluacionExterna(Long id);
  List<RespuestaAspectosSusceptiblesVO> consultarAspectosSusceptibles(Integer anhio);
  void registrarAspectosSusceptibles(PeticionRegistroAspectosSusceptiblesVO peticion);
  void eliminarAspectosSusceptibles(Long id);
}
