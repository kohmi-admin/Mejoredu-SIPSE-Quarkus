package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class EvidenciaComplementariaVO extends FormularioEvidenciaVO {
  private Integer idArticulacion;
}
