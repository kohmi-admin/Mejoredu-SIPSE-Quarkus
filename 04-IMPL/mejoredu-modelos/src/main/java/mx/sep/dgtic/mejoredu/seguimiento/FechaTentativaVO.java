package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FechaTentativaVO {
  private Integer idFechaTentativa;
  private Integer idActividad;
  private Integer idMes;
}
