package mx.mejoredu.dgtic.service;

import mx.edu.sep.dgtic.mejoredu.evaluacion.*;

import java.util.List;

public interface EvaluacionInternaService {
  List<RespuestaInformeAutoevaluacionVO> consultarInformesAutoevaluacion(Integer anhio, Integer trimestre);
  void registrarInformeAutoevaluacion(PeticionRegistroInformeAutoevaluacionVO peticion);
  void eliminarInformeAutoevaluacion(Long id);
  List<RespuestaEvidenciaAutoevaluacionVO> consultarEvidenciasAutoevaluacion(Integer anhio, Integer trimestre);
  void registrarEvidenciasAutoevaluacion(PeticionRegistroEvidenciaAutoevaluacionVO peticion);
  void eliminarEvidenciasAutoevaluacion(Long id);
  List<RespuestaEvaluacionVO> consultarEvaluaciones(Integer anhio);
  void registrarEvaluacion(PeticionRegistroEvaluacionVO peticion);
  void eliminarEvaluacion(Long id);
}
