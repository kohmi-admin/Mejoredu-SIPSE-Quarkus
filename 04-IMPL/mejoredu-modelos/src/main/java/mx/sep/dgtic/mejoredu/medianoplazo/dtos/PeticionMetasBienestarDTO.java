package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionMetasBienestarDTO {
  private Integer idMetas;
  private Integer idEstructura;
  private String cveUsuario;
  private String estatus;
  private Integer ixTipo;
  private List<ElementoDTO> elemento = new ArrayList<>();
  private List<AplicacionMetodoDTO> aplicacionMetodo = new ArrayList<>();
  private List<ValorLineaBase> valorLineaBase = new ArrayList<>();
  private List<SerieHistorica> serieHistorica = new ArrayList<>();
  private List<SerieHistorica> metasIntermedias = new ArrayList<>();
}
