package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AplicacionMetodoDTO {
	private Integer idAplicacion;
	private String nombreVariable;
	private String valorVariableUno;
	private String  fuenteInformacion;
	private String nombreVariableDos;
	private String valorVariableDos;
	private String  fuenteInformacionDos;
	private String  sustitucion;
}
