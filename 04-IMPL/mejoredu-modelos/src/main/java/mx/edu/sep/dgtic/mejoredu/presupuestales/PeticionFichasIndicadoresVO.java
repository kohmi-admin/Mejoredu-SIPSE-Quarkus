package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionFichasIndicadoresVO {
  private DatosGeneralesIndicadorVO datosGenerales;
  private LineaBaseVO lineaBase;
  private MetaAnualVO metaAnual;
  private CaracteristicasVariablesIndicadorVO caracteristicasVariables;
}
