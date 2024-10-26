package mx.sep.dgtic.mejoredu.seguimiento.presupuesto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PartidaPresupuestalVO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionPresupuestoVO {
  private Integer idProducto;
  private String cveUsuario;
  private Integer cveAccion;
  private String nombreAccion;
  private String cveNivelEducativo;
  private Integer idCentroCostos;
  private Double presupuestoAnual;
  private Integer idFuenteFinanciamiento;
  private List<PartidaPresupuestalVO> partidasPresupuestales;
  private String estatus;
  private Integer idAdecuacionSolicitud;
  private Integer idPresupuestoReferencia;
}
