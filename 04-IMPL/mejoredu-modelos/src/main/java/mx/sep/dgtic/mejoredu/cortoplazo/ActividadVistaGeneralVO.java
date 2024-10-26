package mx.sep.dgtic.mejoredu.cortoplazo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActividadVistaGeneralVO {
//  public String programaInstitucional;
  public Integer cveActividad;
  public Integer idActividad;
  public String cxNombreActividad;
//  public String acuerdosSEP;
//  public String proyectosOEI;
  public String csEstatus;
  public Integer agenda;
  private List<ProductoVO> productos;


}
