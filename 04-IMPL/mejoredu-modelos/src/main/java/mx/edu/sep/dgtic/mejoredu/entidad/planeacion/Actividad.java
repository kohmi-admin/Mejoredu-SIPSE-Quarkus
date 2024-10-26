package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Actividad {
	private String idActividad;
	private Integer idProyecto;
	private String nombreActividad;
	private String descripcion;
	private Integer estrategiaPrioritaria;
	private Integer actionPuntual;
	private String articulacionActividad;
	private Integer actividadTransversal;
	private Integer reuniones;
	private String tema;
	private Integer alcance;
	private String lugar;
	private String actores;
	private LocalDate fechaTentativa;
}
