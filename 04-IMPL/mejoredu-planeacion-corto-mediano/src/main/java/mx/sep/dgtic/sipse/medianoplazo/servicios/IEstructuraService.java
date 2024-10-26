package mx.sep.dgtic.sipse.medianoplazo.servicios;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.InicioDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionInicioDTO;

public interface IEstructuraService {
	
	RespuestaGenerica registrar (PeticionInicioDTO peticion);
	RespuestaGenerica modificar (PeticionInicioDTO peticion, @PathVariable Integer idEstructura);
	RespuestaGenerica eliminar (Integer idEstructura, String cveUsuario);
	
	MensajePersonalizado<List<InicioDTO>> consultarEstructuraActivos();
	MensajePersonalizado<InicioDTO> consultarEstructuraPorID(Integer idEstructura);
	MensajePersonalizado<InicioDTO> consultarEstructuraPorAnhio(Integer anhio);
	
	RespuestaGenerica finalizarRegistro(Integer idEstructura, String cveUsuario);
	RespuestaGenerica enviarRevision(Integer idEstructura, String cveUsuario);
	RespuestaGenerica enviarValidacionTecnica(Integer idEstructura, String cveUsuario);
	RespuestaGenerica registroAprobado(Integer idEstructura, String cveUsuario);

}
