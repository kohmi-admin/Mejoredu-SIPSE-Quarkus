package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeticionProducto {
	private String cveUsuario;
	private Integer idActividad;
	private String cveProducto;
	private String nombre;
	private String descripcion;
	private Integer idCategorizacion;
	private Integer idTipo;
	private Integer idIndicadorMIR;
	private Integer idIndicadorPI;
	private Integer idNivelEducativo;
	private String vinculacion;
	private Integer idContinuidadOtros;
	private String porPublicar;
	private Integer idAnhoPublicacion;
	private String cveNombreProyectoPOTIC;
	private List<Calendarizacion> calendarizacion;

	private String estatus;
}
