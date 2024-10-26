package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

@Data
public class ActividadBaseVO {
  private Integer idActividad;
  private Boolean observaciones;
  private Integer cveActividad;
  private String cxNombreActividad;
  private String cxDescripcion;
  private String cxArticulacionActividad;
  private String cveUsuario;
  private String dfActividad;
  private String dhActividad;
  private Integer idProyecto;
  private Integer cveProyecto;

  private Integer idUnidad;
  private String cveUnidad;
  private String unidad;

  private String estatusRevision;
}
