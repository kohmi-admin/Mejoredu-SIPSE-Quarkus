package mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArchivoVO {
  private Integer idArchivo;
  private String cxNombre;
  private String cxUuid;
  private TipoDocumentoVO tipoDocumento;
  private Integer anhoPlaneacion;
  private LocalDate dfFechaCarga;
  private LocalTime dfHoraCarga;
  private String csEstatus;
  private String cveUsuario;
}
