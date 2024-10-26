package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

@Data
public class ProductoBaseVO {
  private Integer idProducto;
  private String cveProducto;
  private String cxNombre;
  private String cxDescripcion;
  private String csEstatus;
  private String dfProducto;
  private String dhProducto;
  private Integer idActividad;
  private Integer idIndicadorMIR;
  private String indicadorMIR;
  private Integer idCategorizacion;
  private String categorizacion;
  private Integer idTipoProducto;
  private String tipoProducto;
  private String csEstatusMensual;
}
