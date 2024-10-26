package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.IndicadorMir;

import java.util.List;

@ApplicationScoped
public class IndicadorMirRepository implements PanacheRepositoryBase<IndicadorMir, Integer> {
  public List<IndicadorMir> findByIdAnhioAndIdCatalogoUnidad(int idAnhio, int idCatalogoUnidad) {
    return find("select i from IndicadorMir i join fetch i.productoCalendario pc where i.idAnhio = ?1 and i.idCatalogoUnidad = ?2", idAnhio, idCatalogoUnidad).list();
  }
}
