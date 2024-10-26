package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaNodoVO {
  private Integer idNodo;
  private Integer nivel;
  private String clave;
  private String descripcion;
  private List<RespuestaNodoVO> hijos = new ArrayList<>();
}
