package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.PerfilLaboral;

import java.util.Optional;

@ApplicationScoped
public class PerfilLaboralRepository implements PanacheRepositoryBase<PerfilLaboral, Integer> {
  public Optional<PerfilLaboral> findByCveUsuario(String cveUsuario) {
    return find("cveUsuario", cveUsuario).firstResultOptional();
  }
}
