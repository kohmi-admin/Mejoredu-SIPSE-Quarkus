package mx.sep.dgtic.mejoredu.cortoplazo;

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
  private Integer cveProyecto;
  private String cxNombreProyecto;
  private String cxObjetivo;
  private String cxObjetivoPrioritario;
  private String cveUsuario;
  private Integer idAnhio;
  private EstatusEnum csEstatus;
  private List<ContribucionCatalogo> contribucionObjetivo; 
  private Integer contribucionProgramaEspecial;
  private List<ContribucionCatalogo> contribucionPNCCIMGP;
  private Archivo archivo;
  private String cxNombreUnidad;
  private String cveUnidad;
  private String cxAlcance;
  private String cxFundamentacion;
}
