package mx.sep.dgtic.mejoredu.cortoplazo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetasBienestarDTO {
  private Integer idMeta;
  private String cveObjetivoPrioritario;
  private String cveMetaParametro;
  private String nombreDelIndicadorPI;
  private String periodicidad;
  private String periodicidadOtro;
  private String unidadDeMedida;
  private String unidadDeMedidaOtro;
  private String tendenciaEsperada;
  private String tendenciaOtro;
  private String fuenteVariable1;
  private String fuenteOtro;
  private Long entregables;
  private Integer anhio;
  private String cveUsuario;

}
