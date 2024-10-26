package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetaReporte {
  private Integer idMetasBienestar;
  private String nombre;
  private String meta;
  private Integer idObjetivo;
  private String objetivo;
}
