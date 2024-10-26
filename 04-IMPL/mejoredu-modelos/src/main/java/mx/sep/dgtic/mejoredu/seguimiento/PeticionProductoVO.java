package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionProducto;
import mx.edu.sep.dgtic.mejoredu.seguimiento.JustificacionActividadVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.JustificacionAdecuacionVO;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionProductoVO extends PeticionProducto {
  private Integer idAdecuacionSolicitud;
  private Integer idProductoReferencia;

  private JustificacionAdecuacionVO adecuacionMir;
  private JustificacionActividadVO adecuacionPi;
}
