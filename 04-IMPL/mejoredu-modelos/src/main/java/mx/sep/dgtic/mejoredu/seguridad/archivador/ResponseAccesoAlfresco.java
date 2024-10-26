package mx.sep.dgtic.mejoredu.seguridad.archivador;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseAccesoAlfresco {
	private String codigo;
	private String mensaje;
	private String accessToken;
	private String uuidPlaneacion;
	private String uuidSeguimiento;
	private String uuidEvaluacion;
	private String uuidReporte;
	private String uuidConfiguracion;
	private String urlAlfresco;
	private String uuidDocApoyo;
	private String uuidAyuda;
	private String uuidNormatividad;
	
}
