package mx.sep.dgtic.mejoredu.seguimiento.service;

import mx.sep.dgtic.mejoredu.seguimiento.SolicitudFirmaDTO;

public interface SolicitudFirmaService {

	Integer registrar(SolicitudFirmaDTO comentario);

	SolicitudFirmaDTO consultaPorId(Integer id);

	void actualizaPorId(Integer id, SolicitudFirmaDTO comentario);

	void eliminar(Integer id);

}