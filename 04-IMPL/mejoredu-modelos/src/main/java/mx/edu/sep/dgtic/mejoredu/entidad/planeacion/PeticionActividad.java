package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.seguimiento.EstrategiaAcciones;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionActividad {
	private Integer cveActividad;
	private Integer idProyecto;
	private String nombreActividad;
	private String descripcion;
	private List<EstrategiaAcciones> objetivo; //Objetivo Prioritario
	private List<EstrategiaAcciones> estrategia;
	private List<EstrategiaAcciones> action;
	private String articulacionActividad;
	private Integer actividadTransversal;
	private Integer reuniones;
	private String tema;
	private Integer alcance;
	private String lugar;
	private String actores;
	private String cveUsuario;
	private List<FechaTentativa> fechaTentativa;
	private String estatus;
	
}
