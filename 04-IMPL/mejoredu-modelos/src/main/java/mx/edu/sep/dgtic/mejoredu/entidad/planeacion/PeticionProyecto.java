package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Archivo;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeticionProyecto {
	private Integer idProyecto;
	private Integer idAnhio;
	private String claveUnidad;
	private String nombreUnidad;
	private String objetivo;
	private String fundamentacion;
	private String alcance;
	private List<ContribucionCatalogo> contribucionObjetivo;
	private Integer contribucionProgramaEspecial;
	private List<ContribucionCatalogo> contribucionPNCCIMGP;
	private List<Archivo> archivos;
	private String cveUsuario;
	private Integer cveProyecto;
	private String nombreProyecto;
	private String objetivoPriori;
	private String csEstatus;
	private Integer idAccion;
}
