package mx.sep.dgtic.mejoredu.seguimiento.presupuesto;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;

@Data
public class RespuestaAdecuacionPresupuestoVO {
  private Integer idPresupuestoModificacion;
  private RespuestaPresupuesto presupuestoModificacion;
  private Integer idPresupuestoReferencia;
  private RespuestaPresupuesto presupuestoReferencia;
}
