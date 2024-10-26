package mx.edu.sep.dgtic.mejoredu.seguridad.services;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguridad.PeticionUsuario;

import java.util.List;

public interface IGestorUsuarioService {
	
	RespuestaGenerica registrar(PeticionUsuario peticion);
	List<PeticionUsuario>consultarTodos();
	RespuestaGenerica eliminar(String cveusuario);

	RespuestaGenerica modificar(String cveUsuario, PeticionUsuario peticion);
	MensajePersonalizado<PeticionUsuario> consultarPorId(String cveUsuario);
}
