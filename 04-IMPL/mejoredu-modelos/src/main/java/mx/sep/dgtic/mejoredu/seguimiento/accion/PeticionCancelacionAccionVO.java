package mx.sep.dgtic.mejoredu.seguimiento.accion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionCancelacionAccionVO {
  private Integer idAdecuacionSolicitud;
  private Integer idAccionReferencia;
}
