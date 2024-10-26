package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import mx.sep.dgtic.mejoredu.seguimiento.AdecuacionDTO;

public interface AdecuacionService {

	void registrar(Integer idSolicitud, List<AdecuacionDTO> adecuacionesDTO);

	List<AdecuacionDTO> consultaPorIdSolicitud(Integer idSolicitud);

	void eliminarPorIdSolicitud(Integer idSolicitud);

}