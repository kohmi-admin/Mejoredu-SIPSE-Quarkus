package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaActividades {
	private Mensaje mensaje;
	private List<Actividad> actividad;
}
