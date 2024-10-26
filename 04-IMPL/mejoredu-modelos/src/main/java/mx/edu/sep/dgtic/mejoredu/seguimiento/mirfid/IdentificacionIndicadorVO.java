package mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IdentificacionIndicadorVO {
	private String nombre;
	private String definicion;
	private Integer ixTipoValorMeta;
	private Boolean indicadorPEF;
	private Integer ixTipoFormula;
	private String tipoFormula;
	private Integer ixEstatusAvance;
}
