package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.RevisionTrimestral;

import java.util.Optional;

@ApplicationScoped
public class RevisionTrimestralRepository implements PanacheRepositoryBase<RevisionTrimestral, Integer> {
    public Optional<RevisionTrimestral> findByIdActividadAndTrimestral(Integer idActividad,Integer trimestre) {
        return find("idActividad = ?1 and trimestre = ?2", idActividad, trimestre).firstResultOptional();
    }
}
