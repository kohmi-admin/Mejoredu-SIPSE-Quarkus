package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroFormularioAnaliticoVO {
  private String nombreUnidad;
  private String clave;
  private String nombreProyecto;
  private String objetivo;
  private String fundamentacion;
  private String alcance;
  private String contribucionPI;
  private String contribucionPND;
  private Integer anhio;
  private String cveUsuario;
}
