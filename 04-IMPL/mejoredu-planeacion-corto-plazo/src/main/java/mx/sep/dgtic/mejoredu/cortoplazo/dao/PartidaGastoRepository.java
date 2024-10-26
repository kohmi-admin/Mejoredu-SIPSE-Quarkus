package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.PartidaGasto;

@ApplicationScoped
public class PartidaGastoRepository implements PanacheRepositoryBase<PartidaGasto, Integer> {
}
