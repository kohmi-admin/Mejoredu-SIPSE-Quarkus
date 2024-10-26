package mx.edu.sep.dgtic.mejoredu.presupuestales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NodoVO {
  private Integer idNodo;
  private String clave;
  private String descripcion;
  private List<NodoVO> hijos = new ArrayList<>();
}
