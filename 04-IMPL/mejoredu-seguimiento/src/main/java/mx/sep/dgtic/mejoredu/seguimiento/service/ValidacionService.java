package mx.sep.dgtic.mejoredu.seguimiento.service;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ValidacionDTO;

public interface ValidacionService {

	
	RespuestaGenerica guardar(ValidacionDTO peticion);

	MensajePersonalizado<ValidacionDTO> consultarRevision(String apartado, Integer id, String rol);

}
