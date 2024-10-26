package mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaSeguimientoMirFidVO {
  private IdentificacionProgramaPresupuestarioVO programa;
  private IdentificacionIndicadorVO indicador;
  private CicloPresupuestarioVO ciclo;
  private CicloPresupuestarioAjustadoVO cicloAjustado;
  private MetaCicloVO otrasMetas;
  private CicloPresupuestarioAjustadoBaseVO otrasMetasCicloAjustado;
}
