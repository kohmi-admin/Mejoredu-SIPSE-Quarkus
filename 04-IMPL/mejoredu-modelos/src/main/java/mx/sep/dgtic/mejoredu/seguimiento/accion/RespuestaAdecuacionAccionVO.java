package mx.sep.dgtic.mejoredu.seguimiento.accion;

import lombok.Data;

@Data
public class RespuestaAdecuacionAccionVO {
  private Integer idAccionModificacion;
  private RespuestaAccionVO accionModificacion;
  private Integer idAccionReferencia;
  private RespuestaAccionVO accionReferencia;
}
