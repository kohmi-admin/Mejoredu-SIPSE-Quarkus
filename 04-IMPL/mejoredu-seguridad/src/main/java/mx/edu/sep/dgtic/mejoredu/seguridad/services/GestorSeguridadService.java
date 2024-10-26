package mx.edu.sep.dgtic.mejoredu.seguridad.services;

import mx.sep.dgtic.mejoredu.seguridad.PeticionAutenticar;
import mx.sep.dgtic.mejoredu.seguridad.RespuestaAutenticar;
import mx.sep.dgtic.mejoredu.seguridad.TipoUsuarioVO;
import mx.sep.dgtic.mejoredu.seguridad.UsuarioVO;

public interface GestorSeguridadService {
	TipoUsuarioVO consultarTipoUsuarioPorNombre(String nombre);
	UsuarioVO autenticarUsuario(String correo, String contrasenhia);
	UsuarioVO consultarFirma(String cveUsuario);
	RespuestaAutenticar autenticarUsuarioLDAP(PeticionAutenticar peticion);
}
