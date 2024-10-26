package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Mensaje;
import mx.sep.dgtic.mejoredu.cortoplazo.ProyectosVO;
import mx.sep.dgtic.mejoredu.cortoplazo.ProyectosVistaGeneralIdVO;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaProyectosVistaGeneralPorID {
	private Mensaje mensaje;
	private List<ProyectosVistaGeneralIdVO> proyecto;
}
