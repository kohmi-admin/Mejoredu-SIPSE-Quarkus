package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import mx.sep.dgtic.mejoredu.seguimiento.ComentarioSolicitudDTO;

public interface SolicitudComentarioService {

	void registrar(ComentarioSolicitudDTO comentario);

	List<ComentarioSolicitudDTO> consultaPorIdSolicitud(Integer idSolicitud);

	ComentarioSolicitudDTO consultaPorId(Integer id);

	void actualizaPorId(Integer id, ComentarioSolicitudDTO comentario);

	void eliminar(Integer id);

}