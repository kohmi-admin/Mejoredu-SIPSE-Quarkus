package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.ValidacionRubrica;

@ApplicationScoped
public class ValidacionRubricaRepository implements PanacheRepositoryBase<ValidacionRubrica, Integer> {
}
