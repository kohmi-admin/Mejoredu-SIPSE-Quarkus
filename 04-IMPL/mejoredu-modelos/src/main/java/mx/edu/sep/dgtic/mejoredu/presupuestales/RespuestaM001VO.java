package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaM001VO extends PeticionFichasIndicadoresVO {
  private Integer idProgramaPresupuestal;
  private Integer idTipoPrograma;
  private List<ArchivoDTO> archivos;
  private Integer idRamoSector;
  private Integer idUnidadResponsable;
  private String nombrePrograma;
  private Integer idVinculacionODS;
  private String cveUsuario;
  private Integer idAnhio;
  private String estatusPresupuestal;
  private String estatusPlaneacion;
  private String estatusSupervisor;
  private String estatusGeneral;
}
