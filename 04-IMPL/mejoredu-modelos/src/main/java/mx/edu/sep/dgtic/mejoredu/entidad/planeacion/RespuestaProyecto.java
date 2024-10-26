package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaProyecto {
	private Mensaje mensaje;
	private Proyecto proyecto;

}
