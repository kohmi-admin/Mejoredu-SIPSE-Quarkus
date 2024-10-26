package mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IdentificacionProgramaPresupuestarioVO {
  private Integer idUnidad;
  private String claveUnidad;
  private String nombreUnidad;

  private Integer idRamo;
  private String ramo;

  private Integer idProgramaPresupuestario;
  private String nombreProgramaPresupuestario;
}
