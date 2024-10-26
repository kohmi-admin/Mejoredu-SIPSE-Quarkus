package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.MetRevisionValidacionEntity;

@ApplicationScoped
public class MetRevisionValidacionRepository implements PanacheRepositoryBase<MetRevisionValidacionEntity, Integer> {
}
