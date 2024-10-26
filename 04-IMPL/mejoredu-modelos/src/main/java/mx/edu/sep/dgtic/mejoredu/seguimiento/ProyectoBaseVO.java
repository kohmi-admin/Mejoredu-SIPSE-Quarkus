package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

@Data
public class ProyectoBaseVO {
  private Integer idProyecto;
  private Integer idAnhio;
  private String estatus;
  private String estatusRevision;
  private Boolean observaciones;
  private String nombreProyecto;
  private String cveProyecto;
  private String cveUnidad;
}
