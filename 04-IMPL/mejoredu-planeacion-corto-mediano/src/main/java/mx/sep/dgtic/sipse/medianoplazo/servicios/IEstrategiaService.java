package mx.sep.dgtic.sipse.medianoplazo.servicios;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.EstrategiaDTO;

public interface IEstrategiaService {
	List<MasterCatalogoDTO2> consultarCatalogoObjetivos(Integer anhio);
	MensajePersonalizado<List<EstrategiaDTO>> consultarActivos(String idObjetivo);
	MensajePersonalizado<List<EstrategiaDTO>> consultarActivosPorId(Integer idEstrategia);
	

	RespuestaGenerica registrar(EstrategiaDTO peticion);
	RespuestaGenerica modificar(EstrategiaDTO peticion);
	RespuestaGenerica eliminar(EstrategiaDTO peticion);
	RespuestaGenerica eliminarPorIDObjetivo(String cveObjetivo);
	RespuestaGenerica eliminarAccionesPorCveEstrategia(String cveEstrategia);

}
