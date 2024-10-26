package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Epilogo;

import java.util.Optional;

@ApplicationScoped
public class EpilogoRepository implements PanacheRepositoryBase<Epilogo, Integer> {
  public Optional<Epilogo> findFirstByEstructura(Integer idEstructura) {
    return find("idEstructura", idEstructura).firstResultOptional();
  }
}
