package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

@Data
public class RespuestaInformeEvaluacionExternaVO {
  private Long idInformeExterno;
  private Integer anhio;
  private String tipoEvaluacion;
  private String nombreEvaluacion;
  private String tipoInforme;
  private String posicionInstitucional;
  private String aspectosSusceptiblesMejora;
  private ArchivoDTO documentoZip;
}
