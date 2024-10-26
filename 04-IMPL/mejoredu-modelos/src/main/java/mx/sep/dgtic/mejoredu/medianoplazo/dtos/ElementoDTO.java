package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ElementoDTO {
	private Integer idElemento;
	private Integer idObjetivo;
	private String nombre;
	private String descripcion;
	private Integer nivelDesagregacion;
	private Integer periodicidad;
	private String especificarPeriodicidad;
	private Integer tipo;
	private Integer unidadMedida;
	private String especificarUnidadMedida;
	private Integer acumulado;
	private Integer periodoRecoleccion;
	private String especificarPeriodo;
	private Integer dimensiones;
	private Integer disponibilidad;
	private Integer tendencia;
	private Integer UnidadResponsable;
	private String metodoCalculo;
	private String observaciones;
}
