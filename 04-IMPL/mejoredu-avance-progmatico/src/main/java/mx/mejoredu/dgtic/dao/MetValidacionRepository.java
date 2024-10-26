package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.MetValidacionEntity;

@ApplicationScoped
public class MetValidacionRepository implements PanacheRepositoryBase<MetValidacionEntity, Integer> {
}
