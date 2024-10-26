package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Meta;

@ApplicationScoped
public class MetaRepository implements PanacheRepositoryBase<Meta, Integer>{

}
