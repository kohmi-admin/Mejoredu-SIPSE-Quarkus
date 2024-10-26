package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.MasterCatalogo;

@RequestScoped
public class MasterCatalogoRepository implements PanacheRepositoryBase<MasterCatalogo, Integer> {

}
