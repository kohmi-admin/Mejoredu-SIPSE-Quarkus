package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.MetApartadoEntity;


@RequestScoped
public class MetApartadoRepository implements PanacheRepositoryBase<MetApartadoEntity, Integer> {

}
