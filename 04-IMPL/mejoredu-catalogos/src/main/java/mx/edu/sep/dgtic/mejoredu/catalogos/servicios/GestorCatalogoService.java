package mx.edu.sep.dgtic.mejoredu.catalogos.servicios;

import java.util.List;

import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionRegistroCatalgos;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.sep.dgtic.mejoredu.seguridad.TipoUsuarioVO;

public interface GestorCatalogoService {
	TipoUsuarioVO consultarTipoUsuarioPorNombre(String nombre);
	MasterCatalogoDTO consultarOpcion(int idCatalogo);
	List<MasterCatalogo> consultarCatalogo(int idCatalogoPadre);
	List<MasterCatalogoDto> consultarOpcionADTO(int idCatalogoPadre);
	List<MasterCatalogoDto> consultarCatalogoPadres();
	List<MasterCatalogoDto> agregarRegistroCatalgo(PeticionRegistroCatalgos peticion);
	List<MasterCatalogoDto> consultarCatalogoID(int idCatalogo);
    MasterCatalogo guardarCatalogo(PeticionCatalogo peticion);
    MasterCatalogo actualizarCatalogo(int idCatalogo,PeticionCatalogo peticion);
    MasterCatalogo eliminarCatalogo(int idCatalogo);
}
