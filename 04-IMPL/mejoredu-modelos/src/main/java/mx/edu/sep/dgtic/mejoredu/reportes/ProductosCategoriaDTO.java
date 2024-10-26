package mx.edu.sep.dgtic.mejoredu.reportes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ProductosCategoriaDTO {
	private Integer totalProductos;
	private String categoria;
}
