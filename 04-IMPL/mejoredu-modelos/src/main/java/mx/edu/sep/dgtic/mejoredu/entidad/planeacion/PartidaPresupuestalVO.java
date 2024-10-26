package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartidaPresupuestalVO {
	private Integer idCatalogoPartidaGasto;
	private List<Calendarizacion> calendarizacion;
	private Double anual;
	private String cxNombrePartida;
}
