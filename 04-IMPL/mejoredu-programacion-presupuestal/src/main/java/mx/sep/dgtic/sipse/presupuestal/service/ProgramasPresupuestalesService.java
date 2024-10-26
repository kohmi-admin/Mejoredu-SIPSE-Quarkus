package mx.sep.dgtic.sipse.presupuestal.service;

import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionM001VO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaM001VO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaProgramaPresupuestalVO;

import java.util.List;

public interface ProgramasPresupuestalesService {
  List<RespuestaProgramaPresupuestalVO> consultaPorAnhio(int anho, boolean consultarArchivos);
  RespuestaProgramaPresupuestalVO consultaPorId(int id);
  RespuestaM001VO consultaPorIdM001(int id);
  RespuestaM001VO consultarM001PorAnhio(int anhio);
  RespuestaM001VO consultaPorIdO001(int id);
  RespuestaM001VO consultarO001PorAnhio(int anhio);
  void registrarM001(PeticionM001VO programa);
  void registrarO001(PeticionM001VO programa);
  void eliminar(int id);
  void enviarRevision(PeticionPorID peticionPorID);
  void enviarValidacionTecnica(PeticionPorID peticionPorID);
  void finalizarRegistro(PeticionPorID peticionPorID);
}
