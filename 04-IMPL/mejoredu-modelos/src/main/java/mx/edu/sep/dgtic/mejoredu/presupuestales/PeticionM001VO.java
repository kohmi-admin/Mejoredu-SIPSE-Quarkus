package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.CargaArchivoDTO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionM001VO extends PeticionFichasIndicadoresVO {
  private List<CargaArchivoDTO> archivos;
  private Integer idRamoSector;
  private Integer idUnidadResponsable;
  private String nombrePrograma;
  private Integer idVinculacionODS;
  private String cveUsuario;
  private Integer idAnhio;
}
