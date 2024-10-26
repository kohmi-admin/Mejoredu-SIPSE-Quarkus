package mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoDocumentoVO {
  private Integer idTipoDocumento;
  private String cdTipoDocumento;
  private String cxExtension;
  private String cxTipoContenido;
}
