package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.CargaArchivoDTO;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionArbolObjetivoVO {
  private Integer idAnhio;
  private String problemaCentral;
  private CargaArchivoDTO esquema;
  private List<PeticionNodoArbolObjetivoVO> medios = new ArrayList<>();
  private List<PeticionNodoArbolObjetivoVO> fines = new ArrayList<>();
}
