package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Avance;
import mx.mejoredu.dgtic.entity.ProductoCalendario;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class AvanceRepository implements PanacheRepositoryBase<Avance, Integer> {
  public Optional<Avance> findByIdProductoAndTrimestre(Integer idProducto, Integer trimestre) {
    return find("""
    select a from Avance a
      where a.productoCalendario.idProducto = ?1
      AND CAST(CEIL(a.productoCalendario.ciMes / 3) AS INTEGER) = ?2
      AND a.evidenciaTrimestral IS NOT NULL
    """, idProducto, trimestre).firstResultOptional();
  }

}
