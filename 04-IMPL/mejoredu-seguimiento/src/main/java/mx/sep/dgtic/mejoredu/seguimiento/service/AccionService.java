package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.accion.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Presupuesto;

public interface AccionService {
	List<RespuestaAdecuacionAccionVO> consultarAccionModificacion(int idAdcuacionSolicitud);

	List<RespuestaAdecuacionAccionVO> consultarAccion(int idAdcuacionSolicitud);

	List<RespuestaAdecuacionAccionVO> consultarAccionCancelacion(int idAdcuacionSolicitud);
	List<RespuestaAccionVO> consultarPorProductoSolicitud(int idProducto, boolean excluirCortoPlazo, int idSolicitud);
	List<RespuestaAccionVO> consultarPorProducto(int idProducto);
	RespuestaAccionVO consultarPorId(int idAccion);

	List<Presupuesto> consultarPorIdList(int idAccion);

	RespuestaRegistroAccionVO registrar(PeticionAccionVO peticion);
	void modificar(int idAccion, PeticionAccionVO peticion);
	void eliminar(int idAccion);
	void eliminarAdecuacion(PeticionEliminarModificacion peticion);
	void cancelarAccion(PeticionCancelacionAccionVO peticion);
	MensajePersonalizado<Integer> secuencialPorProducto(Integer idProducto);
}
