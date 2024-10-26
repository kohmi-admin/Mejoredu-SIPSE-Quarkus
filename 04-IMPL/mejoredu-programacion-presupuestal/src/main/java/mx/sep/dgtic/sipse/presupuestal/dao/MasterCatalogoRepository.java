package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.MasterCatalogo;

@ApplicationScoped
public class MasterCatalogoRepository implements PanacheRepositoryBase<MasterCatalogo, Integer> {
}
