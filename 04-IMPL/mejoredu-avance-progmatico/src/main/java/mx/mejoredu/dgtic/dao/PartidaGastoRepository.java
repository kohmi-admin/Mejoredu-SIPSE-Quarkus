package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.PartidaGasto;

/**
 * @author Emmanuel Estrada Gonzalez (emmanuel.estrada)
 * @version 1.0
 */
@ApplicationScoped
public class PartidaGastoRepository implements PanacheRepositoryBase<PartidaGasto, Integer> {
}
