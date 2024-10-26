package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoIndicadorVO {
  private Integer idIndicador;
  private Integer idUnidad;
  private String nivelIndicador;
  private String indicador;
  private String unidad;
  private List<SeguimientoTrimestreVO> trimestres;
}
