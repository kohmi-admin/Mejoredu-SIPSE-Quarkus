package mx.sep.dgtic.mejoredu.seguridad;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioVO {
	
	private String cveUsuario;
	private String csStatus;
	private String correoElectronico;
	private LocalDate df_baja;
	private String idTipoUsuario;
	
	private PersonaVO persona;

	private List<RolVO> roles;
	private PerfilLaboralVO perfilLaboral;

}
