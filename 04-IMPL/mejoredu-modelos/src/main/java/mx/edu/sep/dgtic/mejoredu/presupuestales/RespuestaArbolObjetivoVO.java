package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaArbolObjetivoVO {
  private Integer idArbol;
  private Integer idAnhio;
  private ArchivoDTO esquema;
  private String problemaCentral;
  private List<RespuestaNodoArbolObjetivoVO> medios = new ArrayList<>();
  private List<RespuestaNodoArbolObjetivoVO> fines = new ArrayList<>();
  private LocalDateTime fechaCreacion;
}
