package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductoCalendarioVO {
  private Integer idProductoCalendario;
  private Integer mes;
  private Integer monto;
  private Integer idProducto;
}
