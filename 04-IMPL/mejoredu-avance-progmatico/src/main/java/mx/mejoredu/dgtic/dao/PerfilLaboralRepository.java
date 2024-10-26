package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.PerfilLaboral;

import java.util.Optional;

@ApplicationScoped
public class PerfilLaboralRepository implements PanacheRepositoryBase<PerfilLaboral, Integer> {
    public Optional<PerfilLaboral> findByCveUsuario(String cveUsuario) {
        return find("cveUsuario = ?1", cveUsuario).firstResultOptional();
    }
}
