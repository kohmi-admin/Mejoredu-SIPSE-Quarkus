package mx.sep.dgtic.mejoredu.seguridad;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;

@Data
public class TipoUsuarioVO {
	
	private Integer idTipoUsuario;
	private String cdtipoUsuario;
	private String csEstatus;
	private Integer idBitacora;

}
