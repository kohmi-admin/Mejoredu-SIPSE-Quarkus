package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RegistroEvidenciaMensualVO extends EvidenciaMensualVO {
  private int idProducto;
  private int mes;
}
