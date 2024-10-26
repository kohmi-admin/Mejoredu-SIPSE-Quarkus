package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.util.List;

@Data
public class PeticionRegistroEvidenciaAutoevaluacionVO {
  private Long idEvidencia;
  private Integer anhio;
  private Integer periodo;
  private Integer idApartado;
  private String cveUsuario;
  private List<ArchivoBase> documentos;
}
