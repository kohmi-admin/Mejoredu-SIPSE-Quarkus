package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Roles;

import java.util.List;

@ApplicationScoped
public class RolesRepository implements PanacheRepository<Roles> {
  @Inject
  EntityManager em;

  public List<Roles> findByIdTipoUsuario(Integer idTipoUsuario) {
    return find("idTipoUsuario", idTipoUsuario).list();
  }
}
