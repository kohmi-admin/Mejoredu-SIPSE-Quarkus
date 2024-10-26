package mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroSeguimientoMirFidVO {
	private Integer idAnhio;
	private Integer periodo;
	private String cveUsuario;

	private IdentificacionIndicadorVO indicador;
	private CicloPresupuestarioVO ciclo;
	private CicloPresupuestarioAjustadoVO cicloAjustado;
}
