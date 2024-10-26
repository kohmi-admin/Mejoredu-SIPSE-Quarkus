package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CargaArchivoDTO {
  private String uuid;
  private Integer tipoArchivo;
  private String nombre;
}
