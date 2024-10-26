package mx.edu.sep.dgtic.mejoredu.reportes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ProductosAlineadosEstatusMIRDTO {
	private Integer porcentaje;
	private String categoria;
}
