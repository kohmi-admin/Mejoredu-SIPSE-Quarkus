package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApoyoAdministrativoPresupuestoarioVO {

	private Integer idPrograma;
	private String programa;
	private Integer idUnidad;
	private String unidad;
	private String ramo;
	private String indicador;
	private Double porcentajeIndicador;
	private String justificacion;

}
