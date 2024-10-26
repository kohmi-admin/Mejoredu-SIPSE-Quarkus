package mx.edu.sep.dgtic.mejoredu.catalogos.servicios;

import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;

import java.util.List;

public interface GestorUnidadService {

	List<MasterCatalogoDto> consultarActivos(Integer idUnidadPadre);
	List<MasterCatalogoDto> consultarOpcionADTO(Integer idUnidad);
	MasterCatalogo guardarUnidad(PeticionCatalogo peticion);
	MasterCatalogo actualizarUnidad(PeticionCatalogo peticion, int idUnidad);

	MasterCatalogo eliminarUnidad(int idUnidad);
}
