package mx.sep.dgtic.mejoredu.seguimiento;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.Archivo;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ContribucionCatalogo;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActualizarProyectoAnual {
  private Integer idAnhio;
  private String cveUnidad;
  private String cxNombreUnidad;
  private String cxObjetivo;
  private String cxFundamentacion;
  private Integer cveProyecto;
  private String cxAlcance;
  private List<ContribucionCatalogo> contribucionObjetivo;
  private Integer contribucionProgramaEspecial;
  private List<ContribucionCatalogo> contribucionPNCCIMGP;
  private Archivo archivo;
  private String cveUsuario;
  private String cxNombreProyecto;
  private String cxObjetivoPrioritario;
  private String csEstatus;
}
