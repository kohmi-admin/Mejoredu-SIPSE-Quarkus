package mx.sep.dgtic.sipse.medianoplazo.servicios;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.AccionDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.EstrategiaDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ObjetivoDTO;

public interface IMasterCatalogoService {
	List<MasterCatalogoDTO2> consultarCatalogoObjetivos(Integer anhio);
	RespuestaGenerica registrar(ObjetivoDTO peticion);
	RespuestaGenerica modificar(ObjetivoDTO peticion);
	RespuestaGenerica eliminar(MasterCatalogoDTO peticion);
	
	RespuestaGenerica registrar(AccionDTO peticion);
	
	MensajePersonalizado<List<ObjetivoDTO>> consultarObjetivos();

}
