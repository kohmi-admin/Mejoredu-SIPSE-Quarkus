package mx.sep.dgtic.mejoredu.seguimiento.proyecto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionCancelacionProyectoVO {
  private Integer idAdecuacionSolicitud;
  private Integer idProyectoReferencia;
}
