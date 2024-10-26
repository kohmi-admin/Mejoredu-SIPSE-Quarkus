package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.ValidacionRubrica;

@ApplicationScoped
public class ValidacionRubricaRepository implements PanacheRepositoryBase<ValidacionRubrica, Integer>{

}
