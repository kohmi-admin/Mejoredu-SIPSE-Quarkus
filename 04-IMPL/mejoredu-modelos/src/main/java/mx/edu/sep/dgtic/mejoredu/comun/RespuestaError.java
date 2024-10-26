package mx.edu.sep.dgtic.mejoredu.comun;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaError {
  private String mensaje;
  private String estatus;
  private LocalDateTime fecha;
}
