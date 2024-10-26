package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

@Data
public class RespuestaEvaluacionVO {
  private Long idEvaluacion;
  private Integer anhio;
  private String actor;
  private String nombreEvaluacion;
  private String tipoInforme;
  private String observaciones;
  private String atencionObservaciones;
  private ArchivoDTO documentoZip;
}
