package mx.sep.dgtic.mejoredu.seguimiento.accion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaAccionVO extends PeticionAccionVO {
  private Integer idAccion;
}
