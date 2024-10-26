package mx.edu.sep.dgtic.mejoredu.comun;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccesoAlfresco {

	private String codigo;
	private String mensaje;
	private String accessToken;
	private String uuidPlaneacion;
	private String uuidSeguimiento;
	private String uuidEvaluacion;
	private String uuidReporte;
	private String uuidConfiguracion;
	private String urlAlfresco;

}
