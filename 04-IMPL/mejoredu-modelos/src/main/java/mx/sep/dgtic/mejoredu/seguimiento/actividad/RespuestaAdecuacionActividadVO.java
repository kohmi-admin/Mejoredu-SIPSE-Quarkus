package mx.sep.dgtic.mejoredu.seguimiento.actividad;

import lombok.Data;
import mx.sep.dgtic.mejoredu.seguimiento.ActividadVO;

@Data
public class RespuestaAdecuacionActividadVO {
  private Integer idActividadModificacion;
  private ActividadVO actividadModificacion;
  private Integer idActividadReferencia;
  private ActividadVO actividadReferencia;
}
