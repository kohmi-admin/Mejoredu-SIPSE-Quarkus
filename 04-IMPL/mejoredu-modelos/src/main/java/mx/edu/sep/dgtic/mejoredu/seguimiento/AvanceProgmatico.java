package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AvanceProgmatico {
	private Integer idProducto;
	private String cveProyecto;
	private String cveActividad;
	private String cveProducto;
	private List<CalendarioProductosProgramadosVO> productosProgramados = new ArrayList<>();
}
