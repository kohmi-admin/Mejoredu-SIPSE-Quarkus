package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.cortoplazo.ValidacionDTO;

public interface ValidacionService {

	
	RespuestaGenerica guardar(ValidacionDTO peticion);

	MensajePersonalizado<ValidacionDTO> consultarRevision(String apartado, Integer id, String rol);

}
