package mx.sep.dgtic.mejoredu.seguimiento.presupuesto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdecuacionPresupuestoVO {
  private int idAdecuacionSolictud;
  private int idPresupuesto;
  private List<PartidaAdecuacionVO> ajustes;
}
