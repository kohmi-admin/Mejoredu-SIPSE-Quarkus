package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.ArchivoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.RegistroArchivoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectosVistaGeneral;
import mx.sep.dgtic.mejoredu.cortoplazo.FormularioAnaliticoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.RegistroFormularioAnaliticoVO;

import java.util.List;
import java.util.Set;

public interface FormularioAnaliticoService {
	List<FormularioAnaliticoVO> listarFormularios();

	FormularioAnaliticoVO registrarFormulario(RegistroFormularioAnaliticoVO registroFormularioAnaliticoVO);

	FormularioAnaliticoVO obtenerFormulario(Long idFormulario);

	FormularioAnaliticoVO actualizarFormulario(Long idFormulario, RegistroFormularioAnaliticoVO formularioAnaliticoVO);

	Set<ArchivoVO> listarArchivos(Long idFormulario);

	ArchivoVO agregarArchivo(Long idFormulario, RegistroArchivoVO archivo);
	
}
