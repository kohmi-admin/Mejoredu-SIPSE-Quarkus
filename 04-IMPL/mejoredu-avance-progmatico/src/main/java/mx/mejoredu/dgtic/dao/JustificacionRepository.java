package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Justificacion;

@ApplicationScoped
public class JustificacionRepository implements PanacheRepositoryBase<Justificacion, Integer> {
}
