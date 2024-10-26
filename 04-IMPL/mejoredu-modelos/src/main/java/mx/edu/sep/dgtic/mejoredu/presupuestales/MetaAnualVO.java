package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetaAnualVO {
  private String valorAnual;
  private Integer idAnhio;
  private String periodoCumplimiento;
  private String medioVerificacion;
}
