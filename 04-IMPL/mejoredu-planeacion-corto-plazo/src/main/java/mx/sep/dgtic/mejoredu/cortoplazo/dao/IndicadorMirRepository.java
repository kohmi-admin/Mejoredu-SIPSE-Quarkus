package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.IndicadorMir;

import java.util.List;

@ApplicationScoped
public class IndicadorMirRepository implements PanacheRepositoryBase<IndicadorMir, Integer> {
  public List<IndicadorMir> findByIdAnhioAndIdCatalogoUnidad(int idAnhio, int idCatalogoUnidad) {
    return find("select i from IndicadorMir i join i.productoCalendario pc on i.idProducto=pc.idProducto and pc.ciMonto > 0 where i.idAnhio = ?1 and i.idCatalogoUnidad = ?2", idAnhio, idCatalogoUnidad).list();
  }
}
