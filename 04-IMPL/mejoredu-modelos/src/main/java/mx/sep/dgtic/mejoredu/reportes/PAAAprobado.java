package mx.sep.dgtic.mejoredu.reportes;

import lombok.Data;

@Data
public class PAAAprobado {

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
