package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MasterCatalogo;

@RequestScoped
public class MasterCatalogoRepository implements PanacheRepositoryBase<MasterCatalogo, Integer> {

}
