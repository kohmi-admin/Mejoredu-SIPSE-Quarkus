package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoVO {
  public Integer idProducto;
  public String cxClaveCompleta;
  public String cxNombreProducto;
  public String categoria;
  public String tipo;
  public String cxEstatus;
  public String indicadorMIR;
  public List<ProductoCalendarioVO> calendario;
  public String agendaAutoridades;
  public Integer idActividad;
  private List<PresupuestoVO> presupuestos;

}
