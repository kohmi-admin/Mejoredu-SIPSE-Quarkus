package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.IndicadorPrograma;

@ApplicationScoped
public class IndicadorProgramaRepository implements PanacheRepositoryBase<IndicadorPrograma, Integer> {
  public Optional<IndicadorPrograma> findByIdProgramaPresupuestal(Integer idProgramaPresupuestal) {
    return find("idPresupuestal", idProgramaPresupuestal).firstResultOptional();
  }
}
