package mx.sep.dgtic.mejoredu.seguimiento.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PresupuestoJasper {

	private String partida;
	@Builder.Default
	private String clave = "";
	@Builder.Default
	private Double importe = 0.0;
	@Builder.Default
	private String mes = "";
	@Builder.Default
	private String claveAmpliacion = "";
	@Builder.Default
	private Double importeAmpliacion = 0.0;
	@Builder.Default
	private String mesAmpliacion = "";
	private Double importeNeto;
}