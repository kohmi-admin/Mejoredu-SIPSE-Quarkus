package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.FichaIndicadores;

@ApplicationScoped
public class FichaIndicadoresRepository implements PanacheRepositoryBase<FichaIndicadores, Integer> {
}
