package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoDTO {
  private Integer idProducto;
  private String cxProducto;
  private String cxNombre;
  private String cveProducto;
  private String cxDescripcion;
  private String cbIndicadorPI;
  private String cxViculacionProducto;
  private String cbPorPublicar;
  private String cxProductosVinculadosPOTIC;
  private String cveUsuario;
  private Integer idActividad;
  private String estatus;
  private Integer idTipoDeProducto;
  private Integer idCatalogoIndicador;
  private Integer idNivelEducativo;
  private String cveNombrePOTIC;
  private Integer idCategorizacion;
  private Integer idContinuidad;
  private Integer idAnhioPublicacion;
}
