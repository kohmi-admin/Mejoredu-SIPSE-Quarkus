package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.MetArchivoValidacionEntity;

@RequestScoped
public class MetArchivoValidacionRepository implements PanacheRepositoryBase<MetArchivoValidacionEntity, Integer> {

}
