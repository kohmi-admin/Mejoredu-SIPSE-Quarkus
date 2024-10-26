package mx.edu.sep.dgtic.mejoredu.catalogos.daos;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.RequestScoped;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;

@RequestScoped
public class MasterCatalogoRepositorio implements PanacheRepository<MasterCatalogo> {

	public List<MasterCatalogo> consultaCatalogo(int idCatalogo) {
		return find("idCatalogoPadre.idCatalogo", idCatalogo).list();
	}

	public MasterCatalogoDTO consultaOpcion(int idOpcion) {
		PanacheQuery<MasterCatalogo> pCat = find("idCatalogo", idOpcion);
		MasterCatalogo mCat = pCat.firstResult();
		return this.obtenerMasterCatalogo(mCat);
	}

	public MasterCatalogoDto consultaOpcionADTO(int idOpcion) {
		PanacheQuery<MasterCatalogoDto> pCat = find("idCatalogo", idOpcion).project(MasterCatalogoDto.class);
		MasterCatalogoDto mCat = pCat.firstResult();
		return mCat;
	}

	private MasterCatalogoDTO obtenerMasterCatalogo(MasterCatalogo masterCatalogo) {
		MasterCatalogoDTO masterCat = new MasterCatalogoDTO(masterCatalogo.getIdCatalogo(),
				masterCatalogo.getCcExterna(), masterCatalogo.getCdOpcion(), "A", "superusuario", masterCatalogo.getCdDescripciondos());

		return masterCat;
	}
	//SELECT new mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto (idCatalogo, cdOpcion, ccExterna, idDependencia) FROM mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo WHERE MasterCatalogo2.idCatalogo = ?1
	public List<MasterCatalogoDto> consultaCatalogoADTO(int idOpcion) {
		PanacheQuery<MasterCatalogoDto> pCat = find("idCatalogo = ?1 and dfBaja is null", idOpcion).project(MasterCatalogoDto.class);
		return pCat.list();
	}

}
