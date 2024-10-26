package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.MetElementoValidarEntity;

@RequestScoped
public class MetElementoValidarRepository implements PanacheRepositoryBase<MetElementoValidarEntity, Integer> {

}
