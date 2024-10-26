package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.Archivo;


import java.util.List;

@Data
public class MetasVencidas {
	private String cveUsuario;
	private String registroDeMeta;
	private String cveYNombreActividad;
	private String cveYNombreProducto;
	private String indicadorMIR;
	private List<CalendarioProductosProgramadosVO> productosProgramados;
	private List<calendarioProductosEntregados> productosEntregados;
	private String estatus;
	private String descripcionDeTareasRealizadas;
	private String descripcionDeProductosAlcanzados;
	private String articulacionConActividades;
	private String dificultadesParaSuRealizacion;
	private Boolean revisado;
	private String aprobado;
	private Boolean publicacion;
	private String tipoPublicacion;
	private String especificarPublicacion;
	private Boolean difusion;
	private String tipoDifusion;
	private String especificarDifusion;
	private Archivo archivo;

}
