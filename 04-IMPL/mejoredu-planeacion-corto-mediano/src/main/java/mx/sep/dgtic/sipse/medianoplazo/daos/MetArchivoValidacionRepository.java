package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MetArchivoValidacionEntity;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MetRevisionValidacionEntity;

@RequestScoped
public class MetArchivoValidacionRepository implements PanacheRepositoryBase<MetArchivoValidacionEntity, Integer> {

}