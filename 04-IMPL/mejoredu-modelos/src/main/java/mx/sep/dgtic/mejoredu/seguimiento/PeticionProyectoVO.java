package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionProyecto;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeticionProyectoVO extends PeticionProyecto {
  private Integer idAdecuacionSolicitud;
  private Integer idProyectoReferencia;
}