package mx.sep.dgtic.mejoredu.seguimiento.service;

import java.util.List;
import java.util.Set;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.ArchivoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.RegistroArchivoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.FormularioAnaliticoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.RegistroFormularioAnaliticoVO;

public interface FormularioAnaliticoService {
	List<FormularioAnaliticoVO> listarFormularios();

	FormularioAnaliticoVO registrarFormulario(RegistroFormularioAnaliticoVO registroFormularioAnaliticoVO);

	FormularioAnaliticoVO obtenerFormulario(Long idFormulario);

	FormularioAnaliticoVO actualizarFormulario(Long idFormulario, RegistroFormularioAnaliticoVO formularioAnaliticoVO);

	Set<ArchivoVO> listarArchivos(Long idFormulario);

	ArchivoVO agregarArchivo(Long idFormulario, RegistroArchivoVO archivo);

}
