package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.CatMasterCatalogo;

import java.util.List;

/**
 * 
 */
@ApplicationScoped
public class MasterCatalogoRepository implements PanacheRepositoryBase<CatMasterCatalogo, Integer> {
    public List<CatMasterCatalogo> findByIdPadre(int idPadre) {
        return find("idCatalogoPadre", idPadre).stream().toList();
    }
}
