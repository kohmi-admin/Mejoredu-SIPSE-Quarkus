package mx.sep.dgtic.mejoredu.seguimiento.actividad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionCancelacionActividadVO {
  private Integer idAdecuacionSolicitud;
  private Integer idActividadReferencia;
}
