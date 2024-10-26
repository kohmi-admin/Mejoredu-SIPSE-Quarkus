package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionDiagnosticoVO {
  private Integer anho;
  private String cveUsuario;
  private String antecedentes;
  private String estadoProblema;
  private String evolucionProblema;
  private String definicionProblema;
  private String identificacionPoblacionPotencial;
  private String cobertura;
  private String identificacionPoblacionObjetivo;
  private String cuantificacionPoblacionObjetivo;
  private String frecuenciaActualizacionPoblacion;
  private String analisisAlternativas;
}
