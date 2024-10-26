package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MetValidacionEntity;

@RequestScoped
public class MetValidacionRepository implements PanacheRepositoryBase<MetValidacionEntity, Integer> {

}
