package mx.sep.dgtic.mejoredu.seguimiento.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PresupuestoCalendarioJasper {

	private String nombreAccion;
	private String partidaGasto;
	@Builder.Default
	private Double anual = 0.0;
	@Builder.Default
	private Double enero = 0.0;
	@Builder.Default
	private Double febrero = 0.0;
	@Builder.Default
	private Double marzo = 0.0;
	@Builder.Default
	private Double abril = 0.0;
	@Builder.Default
	private Double mayo = 0.0;
	@Builder.Default
	private Double junio = 0.0;
	@Builder.Default
	private Double julio = 0.0;
	@Builder.Default
	private Double agosto = 0.0;
	@Builder.Default
	private Double septiembre = 0.0;
	@Builder.Default
	private Double octubre = 0.0;
	@Builder.Default
	private Double noviembre = 0.0;
	@Builder.Default
	private Double diciembre = 0.0;

}
