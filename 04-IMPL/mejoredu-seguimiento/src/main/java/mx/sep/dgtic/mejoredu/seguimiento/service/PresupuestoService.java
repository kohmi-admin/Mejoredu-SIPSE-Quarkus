package mx.sep.dgtic.mejoredu.seguimiento.service;

import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPresupuesto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.presupuesto.*;

import java.util.List;

public interface PresupuestoService {
  List<RespuestaAdecuacionPresupuestoVO> consultarPresupuestoModificacion(int idAdecuacionSolicitud);

  @Transactional
  List<RespuestaAdecuacionPresupuestoVO> consultarPresupuesto(int idAdecuacionSolicitud);

  List<RespuestaAdecuacionPresupuestoVO> consultarPresupuestoCancelacion(int idAdecuacionSolicitud);
  List<RespuestaPresupuesto> consultaPorIdProducto(int idProducto);
  List<RespuestaPresupuesto> consultaPorProductoSolicitud(int idProducto, boolean excluirCortoPlazo, int idSolicitud);
  RespuestaPresupuesto consultarPorId(int idPresupuesto);
  RespuestaRegistroPresupuestoVO registrar(PeticionPresupuestoVO peticion);
  void modificar(int idPresupuesto, PeticionPresupuesto peticion);
  void cancelar(PeticionCancelacionPresupuestoVO peticion);
  void eliminar(int idPresupuesto);
  void eliminarAdecuacion(PeticionEliminarModificacion peticion);
  void ampliacion(AdecuacionPresupuestoVO peticion);
  @Deprecated
  RespuestaGenerica reduccion(AdecuacionPresupuestoVO peticion);
  @Deprecated
  void reintegro(AdecuacionPresupuestoVO peticion);
  @Deprecated
  void traspaso(AdecuacionPresupuestoVO peticion);
  void eliminarAjuste(PeticionEliminarModificacion peticion);
  MensajePersonalizado<List<PartidaAdecuacionVO>> consultarAjuste(Integer idPresupuesto,Integer idAdecuacionSolicitud);
}
