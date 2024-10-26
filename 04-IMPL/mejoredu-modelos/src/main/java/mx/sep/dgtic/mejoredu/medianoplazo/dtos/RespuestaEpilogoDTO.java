package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaEpilogoDTO {
  private Integer idEpilogo;
  private Integer idEstructura;
  private String descripcion;
  private String estatus;
  private List<EpilogoArchivoDTO> archivosPI = new ArrayList<>();
  private List<EpilogoArchivoDTO> actas = new ArrayList<>();
}
