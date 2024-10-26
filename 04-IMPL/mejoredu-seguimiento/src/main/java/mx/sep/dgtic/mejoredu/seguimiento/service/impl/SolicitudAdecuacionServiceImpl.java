package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import org.springframework.stereotype.Service;

import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguimiento.service.ISolicitudAdecuacionService;

@Service
public class SolicitudAdecuacionServiceImpl implements ISolicitudAdecuacionService {

	@Override
	public RespuestaGenerica cambiarEstatus(Integer idEstatus, Integer idAdecuacion, String cveUsuario) {

		return new RespuestaGenerica("200", "Exitoso");

	}
}
