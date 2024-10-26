package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArchivoDTO {
  private Integer idArchivo;
  private Integer idTipoDocumento;
  private String cxNombre;
  private String cxUuid;
  private LocalDate dfFechaCarga;
  private LocalTime dfHoraCarga;
  private String csEstatus;
  private String cveUsuario;
  private String cxUuidToPdf;
}
