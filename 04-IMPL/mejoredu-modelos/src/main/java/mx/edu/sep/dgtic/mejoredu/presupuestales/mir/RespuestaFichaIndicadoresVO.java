package mx.edu.sep.dgtic.mejoredu.presupuestales.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionFichasIndicadoresVO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaFichaIndicadoresVO extends PeticionFichasIndicadoresVO {
  private Integer idIndicador;
}
