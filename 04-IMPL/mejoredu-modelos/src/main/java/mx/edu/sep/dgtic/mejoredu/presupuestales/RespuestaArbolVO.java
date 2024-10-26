package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaArbolVO {
  private Integer idArbol;
  private Integer idAnhio;
  private ArchivoDTO esquema;
  private String problemaCentral;
  private List<RespuestaNodoVO> causas = new ArrayList<>();
  private List<RespuestaNodoVO> efectos = new ArrayList<>();
  private LocalDateTime fechaCreacion;
}
