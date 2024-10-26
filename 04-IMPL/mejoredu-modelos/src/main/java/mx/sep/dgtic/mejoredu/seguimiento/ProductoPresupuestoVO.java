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
public class ProductoPresupuestoVO {
  private Integer idPresupuesto;
  private Integer cveAccion;
  private String cxNombrePresupuesto;
  private List<PartidaGastoVO> cxPartidaGasto = new ArrayList<>();
  private String csEstatus;
}
