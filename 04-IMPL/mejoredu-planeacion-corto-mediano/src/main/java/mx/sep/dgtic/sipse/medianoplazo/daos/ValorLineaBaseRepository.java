package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.LineaBase;

@ApplicationScoped
public class ValorLineaBaseRepository implements PanacheRepositoryBase<LineaBase, Integer>{

}
