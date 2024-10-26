package mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CicloPresupuestarioVO extends MetaCicloVO {
  private Float denominador;
}
