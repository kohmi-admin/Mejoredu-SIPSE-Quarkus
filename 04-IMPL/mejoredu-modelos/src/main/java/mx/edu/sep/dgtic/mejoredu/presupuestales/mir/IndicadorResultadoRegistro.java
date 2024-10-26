package mx.edu.sep.dgtic.mejoredu.presupuestales.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IndicadorResultadoRegistro {
  private String nivel;
  private String clave;
  private String resumenNarrativo;
  private String nombreIndicador;
  private String mediosVerificacion;
  private String supuestos;
}
