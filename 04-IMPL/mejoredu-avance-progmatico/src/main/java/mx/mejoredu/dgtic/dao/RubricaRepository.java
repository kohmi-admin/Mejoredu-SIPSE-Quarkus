package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Rubrica;

@ApplicationScoped
public class RubricaRepository implements PanacheRepositoryBase<Rubrica, Integer> {
}
