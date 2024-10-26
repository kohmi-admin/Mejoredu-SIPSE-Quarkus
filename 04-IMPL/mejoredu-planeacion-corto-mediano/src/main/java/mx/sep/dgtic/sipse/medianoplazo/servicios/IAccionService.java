package mx.sep.dgtic.sipse.medianoplazo.servicios;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.AccionDTO;

public interface IAccionService {
	List<MasterCatalogoDTO2> consultarCatalogoObjetivos(Integer anhio);
	MensajePersonalizado<List<AccionDTO>> consultarActivos(String cveAccion);
	MensajePersonalizado<List<AccionDTO>> consultarPorID(Integer idAccion);
	
	RespuestaGenerica registrar(AccionDTO peticion);
	RespuestaGenerica modificar(AccionDTO peticion);
	RespuestaGenerica eliminar(AccionDTO peticion);

}
