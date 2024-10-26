package mx.edu.sep.dgtic.mejoredu.comun;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArchivoBase {
	private Integer idArchivo;
	private Integer idTipoDocumento;
	private String fechaCarga;
	private String uuid;
	private String nombre;
}
