package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.entity.ProductoCalendario;
import mx.sep.dgtic.mejoredu.seguimiento.producto.PeticionCancelacionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.producto.RespuestaAdecuacionProductoVO;
import mx.sep.dgtic.mejoredu.seguimiento.producto.RespuestaRegistroProductoVO;

public interface ProductoService {
	List<RespuestaAdecuacionProductoVO> consultaProductoModificacion(int idAdecuacionSolicitud);

	@Transactional
	List<RespuestaAdecuacionProductoVO> consultaProducto(int idAdecuacionSolicitud);

	List<RespuestaAdecuacionProductoVO> consultaProductoCancelacion(int idAdecuacionSolicitud);
	List<ProductoVO> consultaPorActividadSolicitud(int idActividad, boolean excluirCortoPlazo, int idSolicitud);
	List<ProductoVO> consultaPorActividad(int idActividad);
	ProductoVO consultarPorId(int idProducto);
	RespuestaRegistroProductoVO registrar(PeticionProductoVO peticion);
	void modificar(int idProducto, PeticionProductoVO peticion);
	void eliminar(int idProducto);
	void eliminarAdecuacion(PeticionEliminarModificacion peticion);
	void cancelarProducto(PeticionCancelacionProductoVO peticion);
	MensajePersonalizado<Integer> secuencialPorActividad(Integer idActividad);

	MensajePersonalizado<Integer> secuencialPorProyecto(Integer idProyecto);
	
	List<ProductoCalendario> consultaActividadPorProducto(Integer idProducto, Integer trimestre);
}
