package mx.edu.sep.dgtic.mejoredu.dao.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.dao.entity.JustificacionIndicador;

@ApplicationScoped
public class JustificacionIndicadorRepository implements PanacheRepositoryBase<JustificacionIndicador, Integer> {
}
