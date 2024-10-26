package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.IndicadorResultado;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class IndicadorResultadoRepository implements PanacheRepositoryBase<IndicadorResultado, Integer> {
  // Obtener IndicadorResultado por id con FETCH LEFT JOIN para obtener la FichaIndicadores
  /**
  public Optional<IndicadorResultado> findById(int id) {
    return find("SELECT ir FROM IndicadorResultado ir LEFT JOIN FETCH ir.fichaIndicadores WHERE ir.idIndicadorResultado = ?1", id).firstResultOptional();
  }
   */
  public List<IndicadorResultado> findByIdAnhio(int idAnhio) {
    return find("programaPresupuestal.idAnhio", idAnhio).list();
  }

  public List<IndicadorResultado> findByIdPresupuestal(int idPresupuestal) {
    return find("idPresupuestal", idPresupuestal).list();
  }
}
