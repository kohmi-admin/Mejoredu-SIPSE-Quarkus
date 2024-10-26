package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RespuestaEvidenciaAutoevaluacionVO {
  private Long idEvidencia;
  private Integer anhio;
  private Integer periodo;
  private String cveUsuario;
  private Integer idApartado;
  private String apartado;
  private String unidadAdministrativa;
  private LocalDateTime fechaRegistro;
  private List<ArchivoDTO> documentos;
}
