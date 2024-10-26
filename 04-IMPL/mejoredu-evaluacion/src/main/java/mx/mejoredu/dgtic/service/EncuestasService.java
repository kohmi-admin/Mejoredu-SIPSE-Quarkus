package mx.mejoredu.dgtic.service;

import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroEncuestaVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaEncuentaVO;

import java.util.List;

public interface EncuestasService {
  List<RespuestaEncuentaVO> consultarEncuestas(Integer anio);
  void registrarEncuesta(PeticionRegistroEncuestaVO peticion);
  void eliminarEncuesta(Long idEncuesta);
}
