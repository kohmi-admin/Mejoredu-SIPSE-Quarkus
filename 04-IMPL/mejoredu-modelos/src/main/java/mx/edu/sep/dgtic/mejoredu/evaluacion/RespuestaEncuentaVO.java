package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.util.List;

@Data
public class RespuestaEncuentaVO {
  private Long idEncuesta;
  private Integer anhio;
  private String areaResponsable;
  private String tipoInstrumento;
  private String nombreInstrumento;
  private String objetivo;
  private ArchivoDTO documentoZip;
}
