package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class RespuestaProgramaPresupuestalVO extends PeticionProgramaPresupuestalVO {
  private Integer idProgramaPresupuestal;
  private Timestamp fechaRegistro;
  private Timestamp fechaActualizacion;
  private Timestamp fechaAprobacion;
  private String estatusPresupuestal;
  private String estatusPlaneacion;
  private String estatusSupervisor;
  private String estatusGeneral;
  private List<ArchivoDTO> archivos;
}
