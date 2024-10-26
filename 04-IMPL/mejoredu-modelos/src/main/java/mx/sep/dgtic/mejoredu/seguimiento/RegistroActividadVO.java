package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroActividadVO {
  public Integer cveActividad;
  public String cxNombreActividad;
  public String cxDescripcion;
  public String cbAccionPuntual;
  public String cxArticulacionActividad;
  public String cbActividadInterunidades;
  public String dfReunion;
  public Integer idAnhio;
  public String cveUsuario;
  public String dfActividad;
  public String dhActividad;
  public Integer idProyecto;
}
