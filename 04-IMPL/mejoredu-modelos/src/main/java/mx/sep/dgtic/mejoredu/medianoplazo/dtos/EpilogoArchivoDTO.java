package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EpilogoArchivoDTO {
  private Integer idCarga;
  private String estatus;
  private Integer tipoDocumento;
  private ArchivoDTO archivo;
}
