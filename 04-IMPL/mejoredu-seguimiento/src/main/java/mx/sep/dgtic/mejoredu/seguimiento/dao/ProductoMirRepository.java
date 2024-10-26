package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.ProductoMir;

import java.util.List;

@ApplicationScoped
public class ProductoMirRepository implements PanacheRepositoryBase<ProductoMir, Integer> {
  public List<ProductoMir> findByIdAnhioAndIdCatalogoUnidad(int idAnhio, int idCatalogoUnidad) {
    return list("idAnhio = ?1 and idCatalogoUnidad = ?2", idAnhio, idCatalogoUnidad);
  }
}
