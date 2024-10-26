package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DetallesProductoEstatusProgramaticoVO {
  private Integer idProyecto;
  private Integer cveProyecto;
  private String nombreProyecto;
  private Integer idUnidad;
  private String cveUnidad;
  private String unidad;
  private Integer idActividad;
  private Integer cveActividad;
  private String nombreActividad;
  private Integer idProducto;
  private String cveProducto;
  private String numeroProducto;
  private String nombreProducto;
  private Integer idCategorizacion;
  private String categorizacion;
  private Integer idTipoProducto;
  private String tipoProducto;

  private String nombreProyectoModificado;
  private String nombreActividadModificado;
  private String nombreProductoModificado;

  private List<CalendarizacionProductoVO> calendarizacion = new ArrayList<>();
  private List<ProductoPresupuestoVO> presupuestos = new ArrayList<>();
}
