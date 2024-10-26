package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.AplicacionMetodo;

@ApplicationScoped
public class AplicacionMetodoRepository implements PanacheRepositoryBase<AplicacionMetodo, Integer>{

}
