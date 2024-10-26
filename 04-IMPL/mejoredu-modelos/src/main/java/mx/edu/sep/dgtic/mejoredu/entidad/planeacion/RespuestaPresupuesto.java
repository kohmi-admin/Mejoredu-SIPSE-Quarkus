package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaPresupuesto extends PeticionPresupuesto{
  private Integer idPresupuesto;
  private String dfPresupuesto;
  private String dhPresupuesto;
}
