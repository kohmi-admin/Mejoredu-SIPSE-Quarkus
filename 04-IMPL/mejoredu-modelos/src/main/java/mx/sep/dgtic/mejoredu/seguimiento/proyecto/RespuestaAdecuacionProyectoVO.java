package mx.sep.dgtic.mejoredu.seguimiento.proyecto;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProyectoVO;

@Data
public class RespuestaAdecuacionProyectoVO {
  private Integer idProyectoModificacion;
  private ProyectoVO proyectoModificacion;
  private Integer idProyectoReferencia;
  private ProyectoVO proyectoReferencia;
}
