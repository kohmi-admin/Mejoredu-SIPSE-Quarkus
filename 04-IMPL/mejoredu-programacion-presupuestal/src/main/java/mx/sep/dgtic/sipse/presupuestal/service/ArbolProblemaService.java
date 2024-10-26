package mx.sep.dgtic.sipse.presupuestal.service;

import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionArbolVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaArbolVO;

public interface ArbolProblemaService {
  RespuestaArbolVO consultarPorAnhio(int idAnhio);
  RespuestaArbolVO consultarPorProgramaPresupuestal(int idProgramaPresupuestal);
  RespuestaArbolVO consultarPorId(int id);
  void registrar(PeticionArbolVO arbolProblema);
}
