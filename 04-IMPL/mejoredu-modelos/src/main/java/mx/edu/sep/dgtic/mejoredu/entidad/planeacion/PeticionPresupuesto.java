package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionPresupuesto {
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
}
