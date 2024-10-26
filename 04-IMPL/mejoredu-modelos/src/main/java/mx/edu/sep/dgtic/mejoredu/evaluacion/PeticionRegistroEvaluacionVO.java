package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

@Data
public class PeticionRegistroEvaluacionVO {
  private Long idEvaluacion;
  private String cveUsuario;
  private Integer anhio;
  private String actor;
  private String nombreEvaluacion;
  private String tipoInforme;
  private String observaciones;
  private String atencionObservaciones;
  private ArchivoBase documentoZip;
}
