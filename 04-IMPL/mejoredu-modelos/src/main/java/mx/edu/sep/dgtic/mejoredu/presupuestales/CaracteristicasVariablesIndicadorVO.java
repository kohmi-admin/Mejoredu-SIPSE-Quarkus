package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CaracteristicasVariablesIndicadorVO {
  private String nombreVariable;
  private String descripcionVariable;
  private String fuenteInformacion;
  private String unidadMedida;
  private String frecuenciaMedicion;
  private String metodoRecoleccion;
  private Integer idComportamientoIndicador;
  private Integer idComportamientoMedicion;
  private Integer idTipoValor;
  private Integer idDesagregacion;
  private String descripcionVinculacion;
}
