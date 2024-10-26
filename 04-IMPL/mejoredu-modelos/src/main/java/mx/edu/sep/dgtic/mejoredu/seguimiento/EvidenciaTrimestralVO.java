package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class EvidenciaTrimestralVO extends FormularioEvidenciaVO {
  private String metaSuperada;

  private String cdTipoPublicacion;
  private String cdTipoDifusion;
}
