package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JustificacionActividadVO {
  private Integer idProducto;
  private String cveProducto;
  private String nombreProducto;
  public List<ProductoCalendarioVO> calendario = new ArrayList<>();

  private String justificacion;
  private String causa;
  private String efectos;
  private String otrosMotivos;
}
