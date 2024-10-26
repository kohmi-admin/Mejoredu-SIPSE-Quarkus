package mx.sep.dgtic.mejoredu.cortoplazo;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

import java.util.List;

@Data
public class PeticionRegistroArchivosSeccion {
  private List<ArchivoBase> archivos;
  private Integer idAnhio;
  private Integer subseccion;
  private String usuario;
}
