package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionEpilogoDTO {
  private Integer idEstructura;
  private String descripcion;
  private String estatus;
  private List<CargaArchivoDTO> archivosPI = new ArrayList<>();
  private List<CargaArchivoDTO> actas = new ArrayList<>();
  private String cveUsuario;
}
