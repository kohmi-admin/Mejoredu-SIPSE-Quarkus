package mx.sep.dgtic.mejoredu.seguimiento.accion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeticionAccionVO {
  private Integer idProducto;
  private Integer claveAccion;
  private String nombre;
  private Integer idAdecuacionSolicitud;
  private Integer idAccionReferencia;
  private String cveUnidad;
  private String csEstatus;
}
