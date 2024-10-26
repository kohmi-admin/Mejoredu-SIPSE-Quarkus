package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.AspectosSusceptibles;

@ApplicationScoped
public class AspectosSusceptiblesRepository implements PanacheRepository<AspectosSusceptibles> {
}
