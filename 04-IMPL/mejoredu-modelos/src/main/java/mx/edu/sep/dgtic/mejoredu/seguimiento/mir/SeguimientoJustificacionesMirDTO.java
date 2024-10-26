package mx.edu.sep.dgtic.mejoredu.seguimiento.mir;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SeguimientoJustificacionesMirDTO {
  private Integer idIndicadorResultado;
  private String nivel;
  private String unidad;
  private Integer idCatalogoUnidad;
  private String indicador;
}
