package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.CargaArchivoDTO;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionDatosGeneralesVO {
  private String cveUsuario;
  private String nombreProgramaPresupuestal;
  private List<CargaArchivoDTO> archivos = new ArrayList<>();
  private Integer idRamo;
  private Integer idUnidadResponsable;
  private Integer anho;
  private String finalidad;
  private String funcion;
  private String subfuncion;
  private String actividadInstitucional;
  private Integer idVinculacionODS;
}
