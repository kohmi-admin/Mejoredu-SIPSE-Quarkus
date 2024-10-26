package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.Diagnostico;

import java.util.Optional;

@ApplicationScoped
public class DiagnosticoRepository implements PanacheRepositoryBase<Diagnostico, Integer> {
  public Optional<Diagnostico> findByIdPrograma(Integer idPrograma) {
    return find("idPresupuestal", idPrograma).firstResultOptional();
  }
}
