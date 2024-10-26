package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PartidaPresupuestalVO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PresupuestoVO {
  public Integer idPresupuesto;
  public String cxNombrePresupuesto;
  public PartidaPresupuestalVO cxPartidaGasto;
  public String csEstatus;
}
