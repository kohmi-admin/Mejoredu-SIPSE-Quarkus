package mx.edu.sep.dgtic.mejoredu.comun;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MensajePersonalizado<T> {
  private String codigo;
  private String mensaje;
  private T respuesta;
}
