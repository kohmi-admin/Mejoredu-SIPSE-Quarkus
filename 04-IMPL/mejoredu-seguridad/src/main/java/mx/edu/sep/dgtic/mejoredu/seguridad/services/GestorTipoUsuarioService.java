package mx.edu.sep.dgtic.mejoredu.seguridad.services;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguridad.TipoUsuarioVO;

import java.util.List;

public interface GestorTipoUsuarioService {
	
	RespuestaGenerica registrar(TipoUsuarioVO peticion);
	List<TipoUsuarioVO> consultarTodo();
	MensajePersonalizado<TipoUsuarioVO> consultarPorId(int id);
	RespuestaGenerica modificar(int id, TipoUsuarioVO peticion);
	RespuestaGenerica eliminar(int id);

}
