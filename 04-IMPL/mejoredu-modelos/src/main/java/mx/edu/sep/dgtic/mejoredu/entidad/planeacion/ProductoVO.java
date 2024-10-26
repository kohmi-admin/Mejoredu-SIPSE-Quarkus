package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoVO {
  private Integer idProducto;
  private String cveUsuario;
  private Integer idProyecto;
  private Integer idActividad;
  private String cveProducto;
  private String nombre;
  private String descripcion;
  private Integer idCategorizacion;
  private Integer idTipoProducto;
  private Integer idIndicadorMIR;
  private String indicadorMIR;
  private Integer idIndicadorPI;
  private Integer idNivelEducativo;
  private String vinculacionProducto;
  private Integer idContinuidad;
  private String porPublicar;
  private Integer idAnhoPublicacion;
  private String nombrePotic;
  private List<ProductoCalendarioVO> productoCalendario;
  private String estatus;
}
