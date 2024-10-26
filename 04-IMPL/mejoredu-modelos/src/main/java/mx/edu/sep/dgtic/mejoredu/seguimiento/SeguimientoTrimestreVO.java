package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoTrimestreVO {
  private Integer trimestre;
  private Integer programado;
  private Integer reportado;
}
