package mx.edu.sep.dgtic.mejoredu.reportes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class PresupuestoProyectoDTO {
	private Integer idAnhio;
	private Integer idUnidad;
	private Integer cveUnidad;
	private String cxNombreProyecto;
	private Double totalAnualASignado;
	private Double totalCalendarizado;
}
