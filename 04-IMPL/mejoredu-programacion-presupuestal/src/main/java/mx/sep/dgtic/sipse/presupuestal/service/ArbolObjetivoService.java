package mx.sep.dgtic.sipse.presupuestal.service;

import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionArbolObjetivoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaArbolObjetivoVO;

public interface ArbolObjetivoService {
  RespuestaArbolObjetivoVO consultarPorAnhio(int idAnhio);
  RespuestaArbolObjetivoVO consultarPorProgramaPresupuestal(int idProgramaPresupuestal);
  RespuestaArbolObjetivoVO consultarPorId(int id);
  void registrar(PeticionArbolObjetivoVO arbolObjetivo);
}
