package mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class CicloPresupuestarioAjustadoBaseVO extends MetaCicloVO {
	private String tipoAjuste;

	// Justificacionx
	private String causas;
	private String efectos;
	private String otrosMotivos;
}
