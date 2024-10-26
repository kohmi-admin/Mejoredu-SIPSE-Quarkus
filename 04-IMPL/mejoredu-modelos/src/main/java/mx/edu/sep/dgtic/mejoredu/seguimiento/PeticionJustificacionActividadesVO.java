package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeticionJustificacionActividadesVO {
  private Integer idIndicador;
  private Integer trimestre;

  private List<JustificacionActividadVO> justificaciones = new ArrayList<>();

  private String cveUsuario;
}
