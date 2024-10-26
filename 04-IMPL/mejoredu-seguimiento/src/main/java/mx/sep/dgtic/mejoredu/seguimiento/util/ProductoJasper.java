package mx.sep.dgtic.mejoredu.seguimiento.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoJasper {

	private String producto;
	@Builder.Default
	private Integer enero = 0;
	@Builder.Default
	private Integer febrero = 0;
	@Builder.Default
	private Integer marzo = 0;
	@Builder.Default
	private Integer abril = 0;
	@Builder.Default
	private Integer mayo = 0;
	@Builder.Default
	private Integer junio = 0;
	@Builder.Default
	private Integer julio = 0;
	@Builder.Default
	private Integer agosto = 0;
	@Builder.Default
	private Integer septiembre = 0;
	@Builder.Default
	private Integer octubre = 0;
	@Builder.Default
	private Integer noviembre = 0;
	@Builder.Default
	private Integer diciembre = 0;

}
