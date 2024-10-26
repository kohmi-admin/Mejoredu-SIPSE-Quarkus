package mx.edu.sep.dgtic.mejoredu.comun;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Archivo {
	
	private Integer idArchivo;
	private String uuid;
	private String uuidToPdf;
	private String nombre;
	private String estatus;
	private String usuario;

}
