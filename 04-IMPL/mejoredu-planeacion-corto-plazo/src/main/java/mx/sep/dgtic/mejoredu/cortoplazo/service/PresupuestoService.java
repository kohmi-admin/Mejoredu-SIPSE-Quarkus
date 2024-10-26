package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPresupuesto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;

import java.util.List;

public interface PresupuestoService {
  List<RespuestaPresupuesto> consultaPorIdProducto(int idProducto);

  RespuestaPresupuesto consultarPorId(int idPresupuesto);

  void registrar(PeticionPresupuesto peticion);

  void modificar(int idPresupuesto, PeticionPresupuesto peticion);

  void eliminar(int idPresupuesto);
}
