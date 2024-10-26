package mx.sep.dgtic.mejoredu.seguimiento.producto;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;

@Data
public class RespuestaAdecuacionProductoVO {
  private Integer idProductoModificacion;
  private ProductoVO productoModificacion;
  private Integer idProductoReferencia;
  private ProductoVO productoReferencia;
}
