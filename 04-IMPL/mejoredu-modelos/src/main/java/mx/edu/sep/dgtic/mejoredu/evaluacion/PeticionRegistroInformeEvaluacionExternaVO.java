package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

@Data
public class PeticionRegistroInformeEvaluacionExternaVO {
  private Long idInformeExterno;
  private String cveUsuario;
  private Integer anhio;
  private String tipoEvaluacion;
  private String nombreEvaluacion;
  private String tipoInforme;
  private String posicionInstitucional;
  private String aspectosSusceptiblesMejora;
  private ArchivoBase documentoZip;
}
