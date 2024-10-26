package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.jasper.JasperReportResponse;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionSolicitudDTO;
import mx.sep.dgtic.mejoredu.seguimiento.SolicitudDTO;

public interface SolicitudSeguimientoService {

	SolicitudDTO.IdSolicitud registrar(SolicitudDTO solicitud);

	void actualizaPorId(Integer idSolicitud, SolicitudDTO solicitud);

	SolicitudDTO consultaPorId(int id);

	List<SolicitudDTO> consultaSolicitudes(String usuario, PeticionSolicitudDTO solicitud);

	void eliminar(int idSolicitud);

	MensajePersonalizado<Integer> secuencialFolio(Integer idUnidad);

	MensajePersonalizado<Integer> secuencialFolioAnhio(Integer idAnhio);
	
	RespuestaGenerica cambiarEstatus(Integer idEstatus, Integer idSolicitud, String cveUsuario);

	JasperReportResponse obtenerReporte(Integer idSolicitud);

}