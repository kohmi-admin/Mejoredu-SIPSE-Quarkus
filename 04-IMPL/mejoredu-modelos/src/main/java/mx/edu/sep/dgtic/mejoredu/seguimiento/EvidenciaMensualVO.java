package mx.edu.sep.dgtic.mejoredu.seguimiento;


import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
public class EvidenciaMensualVO {
  private String estatus;
  private String justificacion;
  private String descripcionTareas;
  private String descripcionProducto;
  private String especificarDifusion;
  private List<ArchivoBase> archivos = new ArrayList<>();
}
