package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalendarizacionProductoVO {
  private Integer mes;
  private Integer programado;
  private Integer modificado;
  private Integer entregado;
}
