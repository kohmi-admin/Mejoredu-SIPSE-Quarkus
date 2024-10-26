package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Calendarizacion;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartidaGastoVO {
  private Integer idPartida;
  private List<Calendarizacion> calendarizacion;
  private Double anual;
  private String cxNombrePartida;
}
