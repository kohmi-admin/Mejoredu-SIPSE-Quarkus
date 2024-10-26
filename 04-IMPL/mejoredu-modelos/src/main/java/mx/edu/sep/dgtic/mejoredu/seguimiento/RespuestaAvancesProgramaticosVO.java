package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

@Data
public class RespuestaAvancesProgramaticosVO {
  private Integer idAvance;
  private Integer idEvidenciaMensual;
  private Integer idEvidenciaTrimestral;
  private Integer idProyecto;
  private String cveProyecto;
  private String nombreProyecto;
  private Integer idActividad;
  private String cveActividad;
  private String nombreActividad;
  private Integer idProducto;
  private String cveProducto;
  private String nombreProducto;
  private Integer mes;
  private String cveUsuario;

  private Integer ixTipoRegistro;
}
