package mx.edu.sep.dgtic.mejoredu.reportes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PAAAprobadoDTO {
	private Integer id;
	private Integer idAnhio;
	private String cxOrigen;
	private String cveUnidad;
	private String cveProyecto;
	private String nombreProyecto;
	private String cveActividad;
	private String nombreActividad;
	private String cveProducto;
	private String nombreProducto;
	private String nombreCategoria;
	private String nombreTipo;
	private String mes;
	private String entregable;
}
