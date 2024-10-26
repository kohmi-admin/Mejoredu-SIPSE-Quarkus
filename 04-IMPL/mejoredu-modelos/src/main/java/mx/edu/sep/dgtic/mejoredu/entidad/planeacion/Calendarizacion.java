package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Calendarizacion {
	private Integer mes;
	private Double monto;
	private Double activoD;
	private Integer activo;
	private String nombrePartida;
}
