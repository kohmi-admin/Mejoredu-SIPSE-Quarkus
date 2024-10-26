package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.DatosGenerales;

import java.util.Optional;

@ApplicationScoped
public class DatosGeneralesRepository implements PanacheRepositoryBase<DatosGenerales, Integer> {
  public Optional<DatosGenerales> findByProgramaPresupuestal(Integer idProgramaPresupuestal) {
    return find("idPresupuestal", idProgramaPresupuestal).firstResultOptional();
  }
}
