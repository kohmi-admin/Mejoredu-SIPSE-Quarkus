package mx.edu.sep.dgtic.mejoredu.seguridad.services;

import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.seguridad.PeriodosHabilitacionVO;

import java.util.List;

public interface GestorPeriodoHabilitacionService {
	
	RespuestaGenerica registrar(PeriodosHabilitacionVO peticion);
	List<PeriodosHabilitacionVO> consultarTodo();
	PeriodosHabilitacionVO consultarPorId(int id);
	RespuestaGenerica modificar(int id, PeriodosHabilitacionVO peticion);
	RespuestaGenerica eliminar(int id);

}
