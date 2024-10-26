package mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroOtrasMetasSeguimientoVO {
	private Integer idAnhio;
	private Integer periodo;
	private String cveUsuario;

	private MetaCicloVO otrasMetas;
	private CicloPresupuestarioAjustadoBaseVO cicloAjustado;

}
