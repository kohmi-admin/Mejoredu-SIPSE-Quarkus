package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionActividad;
import mx.sep.dgtic.mejoredu.cortoplazo.ActividadVO;

import java.util.List;

public interface ActividadService {
  List<ActividadVO> consultarPorIdProyecto(int idProyecto, String csStatus);
  ActividadVO consultarPorIdActividad(int idActividad);
  void registrar(PeticionActividad registroActividad);
  void modificar(int idActividad, PeticionActividad registroActividad);
  void eliminar(int idActividad);
}
