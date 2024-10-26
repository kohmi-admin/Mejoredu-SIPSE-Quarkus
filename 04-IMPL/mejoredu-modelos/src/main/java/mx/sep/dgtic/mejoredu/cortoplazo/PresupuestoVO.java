package mx.sep.dgtic.mejoredu.cortoplazo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PartidaPresupuestalVO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PresupuestoVO {
  public Integer idPresupuesto;
  public Integer cveAccion;
  public String cxNombrePresupuesto;
  public PartidaPresupuestalVO cxPartidaGasto;
  public String csEstatus;
}
