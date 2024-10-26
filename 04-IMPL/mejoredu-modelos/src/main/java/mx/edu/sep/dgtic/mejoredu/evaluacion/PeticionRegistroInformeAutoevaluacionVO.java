package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

@Data
public class PeticionRegistroInformeAutoevaluacionVO {
  private Long idInforme;
  private Integer anhio;
  private Integer periodo;
  private String cveUsuario;
  private String nombreInforme;
  private ArchivoBase documentoZip;
}
