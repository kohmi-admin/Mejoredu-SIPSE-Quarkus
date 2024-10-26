package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.IndicadorPrograma;

import java.util.Optional;

@ApplicationScoped
public class IndicadorProgramaRepository implements PanacheRepositoryBase<IndicadorPrograma, Integer> {
  public Optional<IndicadorPrograma> findByIdProgramaPresupuestal(Integer idProgramaPresupuestal) {
    return find("idPresupuestal", idProgramaPresupuestal).firstResultOptional();
  }
}
