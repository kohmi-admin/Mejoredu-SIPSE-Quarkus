package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MetApartadoEntity;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MetRevisionValidacionEntity;

@RequestScoped
public class MetApartadoRepository implements PanacheRepositoryBase<MetApartadoEntity, Integer> {

}
