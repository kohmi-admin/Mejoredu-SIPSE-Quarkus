package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DatosGeneralesIndicadorVO {
  private String nombreIndicador;
  private Integer idDimensionMedicion;
  private Integer idTipoIndicador;
  private String definicionIndicador;
  private String metodoCalculo;
  private Integer idUnidadMedida;
  private String unidadMedidaDescubrir;
  private String unidadAbsoluta;
  private Integer idTipoMedicion;
  private String tipoMedicionDescubrir;
  private Integer idFrecuenciaMedicion;
  private String frecuenciaMedicionDescubrir;
  private String numerador;
  private String denominador;
  private String meta;
}
