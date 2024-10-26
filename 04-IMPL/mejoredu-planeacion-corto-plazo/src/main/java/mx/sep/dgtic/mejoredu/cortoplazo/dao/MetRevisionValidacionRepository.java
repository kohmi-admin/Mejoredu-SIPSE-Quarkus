package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.MetRevisionValidacionEntity;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.MetValidacionEntity;

@RequestScoped
public class MetRevisionValidacionRepository implements PanacheRepositoryBase<MetRevisionValidacionEntity, Integer> {

}
