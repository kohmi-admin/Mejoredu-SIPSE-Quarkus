package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.ProductoCalendario;

import java.util.List;

@ApplicationScoped
public class ProductoCalendarioRepository implements PanacheRepositoryBase<ProductoCalendario, Integer> {
  public List<ProductoCalendario> findByIdProducto(List<Integer> idProducto) {
    return list("idProducto in ?1", idProducto);
  }
}
