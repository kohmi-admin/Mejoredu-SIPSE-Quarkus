package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Archivo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProyectoVO {
  private Integer idProyecto;
  private Integer anhio;
  private String clave;
  private String nombre;
  private String claveUnidad;
  private String nombreUnidad;
  private String objetivo;
  private String fundamentacion;
  private String alcance;
  private List<ContribucionCatalogo> contribucionObjetivoPrioritarioPI;
  private Integer contribucionProgramaEspecial;
  private List<ContribucionCatalogo> contribucionPNCCIMGP;
  private List<Archivo> archivos;
  private String cveUsuario;
  private String estatus;
  private LocalDate dfActualizacion;
  private LocalTime dhActualizacion;
  private LocalDate dfRegistro;
  private LocalTime dhRegistro;
  private String cveUsuarioActualiza;
  private Integer idValidacion;
  private Integer idValidacionPlaneacion;
  private Integer idValidacionSupervisor;
  private String estatusPresupuesto;
  private String estatusPlaneacion;
  private String estatusSupervisor;
  private Integer ixCicloValidacion;
  private Integer ixAccion;
}
