package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.ArchivoVO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaDatosGeneralesVO {
  private Integer idDatosGenerales;
  private String cveUsuario;
  private String nombreProgramaPresupuestal;
  private List<ArchivoDTO> archivos = new ArrayList<>();
  private Integer idRamo;
  private Integer idUnidadResponsable;
  private Integer anho;
  private String finalidad;
  private String funcion;
  private String subfuncion;
  private String actividadInstitucional;
  private Integer idVinculacionODS;
  private String estatusPresupuestal;
  private String estatusPlaneacion;
  private String estatusSupervisor;
  private String estatusGeneral;
}
