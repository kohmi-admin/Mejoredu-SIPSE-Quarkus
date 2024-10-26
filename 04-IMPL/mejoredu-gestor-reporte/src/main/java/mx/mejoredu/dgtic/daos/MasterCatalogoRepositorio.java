package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.CatMasterCatalogo;


import java.util.List;

/**
 * 
 */
@ApplicationScoped
public class MasterCatalogoRepositorio implements PanacheRepositoryBase<CatMasterCatalogo, Integer> {
    public List<CatMasterCatalogo> findByIdPadre(int idPadre) {
        return find("idCatalogoPadre", idPadre).list();
    }
}
