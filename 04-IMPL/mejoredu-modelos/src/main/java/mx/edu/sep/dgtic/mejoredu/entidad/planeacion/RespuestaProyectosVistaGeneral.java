package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;
import mx.sep.dgtic.mejoredu.cortoplazo.ProyectosVO;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaProyectosVistaGeneral {
	private Mensaje mensaje;
	private List<ProyectosVO> proyecto;
}
