package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RegistroEvidenciaTrimestralVO extends FormularioEvidenciaVO {
  private String metaSuperada;

  private int idProducto;
  private int trimestre;
}
