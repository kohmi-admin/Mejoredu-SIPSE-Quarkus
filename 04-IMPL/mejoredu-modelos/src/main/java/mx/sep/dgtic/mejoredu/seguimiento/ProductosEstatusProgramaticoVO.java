package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductosEstatusProgramaticoVO {
  private Integer idUnidad;
  private String cveUnidad;
  private String unidad;
  private Integer idProducto;
  private String cveProducto;
  private String nombreProducto;
  private Integer idCategoria;
  private String categoria;
  private Integer idTipoProducto;
  private String tipoProducto;
  private Integer entregablesProgramados;
  private Integer entregablesFinalizados;
  private String estatus;
  private Boolean revisado;
  private Boolean aprobado;
  private Date fechaAprobacion;
  private Boolean publicado;
  private String tipoPublicacion;
  private String medioDifusion;
}
