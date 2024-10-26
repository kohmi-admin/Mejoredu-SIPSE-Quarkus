package mx.sep.dgtic.mejoredu.seguimiento.service;

import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;

public interface ISolicitudAdecuacionService {
	
	RespuestaGenerica cambiarEstatus(Integer idEstatus, Integer idAdecuacion, String cveUsuario);

}
