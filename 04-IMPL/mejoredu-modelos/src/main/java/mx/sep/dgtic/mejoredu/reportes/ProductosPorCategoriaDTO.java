package mx.sep.dgtic.mejoredu.reportes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductosPorCategoriaDTO {
	private Integer id;
	private Integer idAnhio;
	private String cveProyecto;
	private Integer idUnidad;
	private Integer idCatalogoCategorizacion;
	private Integer cxTotalProducto;
	
}
