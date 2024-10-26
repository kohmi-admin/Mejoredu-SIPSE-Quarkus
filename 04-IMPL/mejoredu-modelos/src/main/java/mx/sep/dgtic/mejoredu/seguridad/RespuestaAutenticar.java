package mx.sep.dgtic.mejoredu.seguridad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaAutenticar {
	private Mensaje mensaje;
	private UsuarioVO datosUsuario;
	
}
