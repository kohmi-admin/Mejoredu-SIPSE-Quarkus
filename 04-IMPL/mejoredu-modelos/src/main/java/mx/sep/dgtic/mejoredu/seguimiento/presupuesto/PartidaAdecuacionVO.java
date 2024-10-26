package mx.sep.dgtic.mejoredu.seguimiento.presupuesto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartidaAdecuacionVO {
	private Integer id;
	private Integer idCatalogoPartidaGasto;
	private Integer mes;
	private Double monto;
	private Integer tipo;
	private String cvePresupuestal;
	private String csEstatus;
}
