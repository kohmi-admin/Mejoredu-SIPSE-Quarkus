package mx.edu.sep.dgtic.mejoredu.reportes;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class RespuestaReportePAAGeneralDTO implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer totalProyectos;
	private Integer totalActividades;
	private Integer totalProductos;
	private Integer totalEntregables;
	private List<ProductosCategoriaDTO> productosCategoria;
	private List<ProyectosUnidad> proyectosUnidad;
	private List<ProductosTipo> productosTipo;
	
}
