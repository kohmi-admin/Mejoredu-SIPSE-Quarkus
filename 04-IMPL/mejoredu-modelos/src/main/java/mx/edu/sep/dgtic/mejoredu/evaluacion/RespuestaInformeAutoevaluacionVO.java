package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

@Data
public class RespuestaInformeAutoevaluacionVO {
  private Long idInforme;
  private Integer anhio;
  private Integer periodo;
  private String cveUsuario;
  private String nombreInforme;
  private ArchivoDTO documentoZip;
}
