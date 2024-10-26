package mx.edu.sep.dgtic.mejoredu.catalogos.servicios;

import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogoDireccion;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;

import java.util.List;

public interface GestorDireccionesService {

MasterCatalogo agregarDireccion(PeticionCatalogoDireccion peticion);

	List<MasterCatalogo> listarDirecciones();

	MasterCatalogo listarDireccionesPorId(Integer id);

	MasterCatalogo actualizarDirecciones(Integer id, PeticionCatalogoDireccion peticion);

	MasterCatalogo eliminarDirecciones(Integer id);
}
