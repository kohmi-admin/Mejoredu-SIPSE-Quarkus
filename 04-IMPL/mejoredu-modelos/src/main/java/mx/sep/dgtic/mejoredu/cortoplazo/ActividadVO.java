package mx.sep.dgtic.mejoredu.cortoplazo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActividadVO {
  public Integer idActividad;
  public Integer cveActividad;
  public String cxNombreActividad;
  public String cxDescripcion;
  public String cxArticulacionActividad;
  public String cveUsuario;
  public String dfActividad;
  public String dhActividad;
  public Integer idProyecto;

  public List<EstrategiaAcciones> objetivo;
  public List<EstrategiaAcciones> estrategia;
  public List<EstrategiaAcciones> accion;
  public Integer icActividadTransversal;
  public Integer ixReunion;
  public String cxTema;
  public Integer idAlcance;
  public String cxLugar;
  public String cxActores;
  public String csEstatus;
  public List<FechaTentativaVO> fechaTentativa;
}
