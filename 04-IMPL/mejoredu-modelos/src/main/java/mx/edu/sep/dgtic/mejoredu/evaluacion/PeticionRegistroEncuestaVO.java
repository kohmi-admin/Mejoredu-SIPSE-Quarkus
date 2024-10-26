package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

@Data
public class PeticionRegistroEncuestaVO {
  private Long idEncuesta;
  private String cveUsuario;
  private Integer anhio;
  private String areaResponsable;
  private String tipoInstrumento;
  private String nombreInstrumento;
  private String objetivo;
  private ArchivoBase documentoZip;
}
