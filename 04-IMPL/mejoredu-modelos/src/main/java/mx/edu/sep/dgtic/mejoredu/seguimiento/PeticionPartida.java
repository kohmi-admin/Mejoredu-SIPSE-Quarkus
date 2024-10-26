package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PeticionPartida {
	private Integer id;
	private String cxNombre;
	private double ixImporte;
	private Integer ixMes;
	private Integer ixTipo;

}
