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
public class PeticionArbolVO {
  private Integer idAnhio;
  private String problemaCentral;
  private CargaArchivoDTO esquema;
  private List<NodoVO> causas = new ArrayList<>();
  private List<NodoVO> efectos = new ArrayList<>();
}
