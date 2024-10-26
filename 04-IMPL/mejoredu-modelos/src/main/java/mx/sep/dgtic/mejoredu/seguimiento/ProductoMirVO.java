package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoMirVO {
  private Integer idProducto;
  private String nivel;
  private String clave;
  private String nombreProducto;
}
