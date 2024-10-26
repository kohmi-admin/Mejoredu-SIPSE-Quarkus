package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RubricaDTO {
	private Integer idRubrica;
	private Integer idRubro;
	private String cxObservaciones;
	private Integer ixPuntuacion;
}
