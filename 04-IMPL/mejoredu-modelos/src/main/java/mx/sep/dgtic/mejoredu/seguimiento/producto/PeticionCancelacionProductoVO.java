package mx.sep.dgtic.mejoredu.seguimiento.producto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionCancelacionProductoVO {
  private Integer idAdecuacionSolicitud;
  private Integer idProductoReferencia;
}
