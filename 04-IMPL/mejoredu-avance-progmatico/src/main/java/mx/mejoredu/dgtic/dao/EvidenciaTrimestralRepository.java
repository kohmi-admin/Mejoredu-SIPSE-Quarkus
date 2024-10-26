package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.EvidenciaTrimestral;

import java.util.Optional;

@ApplicationScoped
public class EvidenciaTrimestralRepository implements PanacheRepositoryBase<EvidenciaTrimestral, Integer> {
  public Optional<EvidenciaTrimestral> findByIdProductoAndMes(int idProducto, int mes) {
    return find("""
      SELECT et FROM EvidenciaTrimestral et
      INNER JOIN FETCH Avance a ON a.evidenciaTrimestral = et
      INNER JOIN FETCH ProductoCalendario pc ON pc = a.productoCalendario
      INNER JOIN FETCH Producto p ON p = pc.producto
      WHERE p.idProducto = ?1 AND pc.ciMes = ?2
      """, idProducto, mes).firstResultOptional();
  }

  public Optional<EvidenciaTrimestral> findByIdAvance(int idAvance) {
    return find("""
      SELECT et FROM EvidenciaTrimestral et
      INNER JOIN FETCH et.avance a
      WHERE a.idAvance = ?1
      """, idAvance).firstResultOptional();
  }
}
