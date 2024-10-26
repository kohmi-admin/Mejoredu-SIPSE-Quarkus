package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.ActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.PeticionCancelacionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.RespuestaAdecuacionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.RespuestaRegistroActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Actividad;

public interface ActividadService {
	List<RespuestaAdecuacionActividadVO> consultarActividadModificacion(int idAdecuacionSolicitud);

	List<RespuestaAdecuacionActividadVO> consultarActividad(int idAdecuacionSolicitud);

	List<RespuestaAdecuacionActividadVO> consultarActividadCancelacion(int idAdecuacionSolicitud);
	List<ActividadVO> consultarPorIdProyectoSolicitud(int idProyecto, boolean excluirCortoPlazo, int idSolicitud);
	List<ActividadVO> consultarPorIdProyecto(int idProyecto, String csStatus);
	ActividadVO consultarPorIdActividad(int idActividad);
	RespuestaRegistroActividadVO registrar(PeticionActividadVO registroActividad);

	List<Actividad> consultarPorIdActividadList(int idActividad);

	void modificar(int idActividad, PeticionActividadVO registroActividad);
	void eliminar(int idActividad);
	void eliminarAdecuacion(PeticionEliminarModificacion peticion);
	void cancelarActividad(PeticionCancelacionActividadVO peticion);
	MensajePersonalizado<Integer> secuencialPorProyecto(Integer idProyecto);
}
