package mx.sep.dgtic.mejoredu.seguimiento.presupuesto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionCancelacionPresupuestoVO {
  private Integer idAdecuacionSolicitud;
  private Integer idPresupuestoReferencia;
}
