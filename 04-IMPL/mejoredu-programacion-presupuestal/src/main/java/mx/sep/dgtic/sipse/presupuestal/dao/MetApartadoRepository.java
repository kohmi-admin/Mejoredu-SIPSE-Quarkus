package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.MetApartadoEntity;

@RequestScoped
public class MetApartadoRepository implements PanacheRepositoryBase<MetApartadoEntity, Integer> {

}
