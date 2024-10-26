package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.SerieMeta;

@ApplicationScoped
public class SerieMetaRepository implements PanacheRepositoryBase<SerieMeta, Integer>{

}
