package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionActividad;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeticionActividadVO extends PeticionActividad {
  private Integer idAdecuacionSolicitud;
  private Integer idActividadReferencia;
}
