package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.EvidenciaMensual;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EvidenciaMensualRepository implements PanacheRepositoryBase<EvidenciaMensual, Integer> {

  public List<EvidenciaMensual> findByIdProducto(int idProducto) {
    return list("""
      SELECT em FROM EvidenciaMensual em
      INNER JOIN FETCH Avance a ON a.evidenciaMensual = em
      INNER JOIN FETCH ProductoCalendario pc ON pc = a.productoCalendario
      INNER JOIN FETCH Producto p ON p = pc.producto
      WHERE p.idProducto = ?1
      """, idProducto);
  }

  public Optional<EvidenciaMensual> findByIdProductoAndMes(int idProducto, int mes) {
    return find("""
      SELECT em FROM EvidenciaMensual em
      INNER JOIN FETCH Avance a ON a.evidenciaMensual = em
      INNER JOIN FETCH ProductoCalendario pc ON pc = a.productoCalendario
      INNER JOIN FETCH Producto p ON p = pc.producto
      WHERE p.idProducto = ?1 AND pc.ciMes = ?2
      """, idProducto, mes).firstResultOptional();
  }

  public Optional<EvidenciaMensual> findByIdAvance(int idAvance) {
    return find("""
      SELECT em FROM EvidenciaMensual em
      INNER JOIN FETCH em.avance a
      WHERE a.idAvance = ?1
      """, idAvance).firstResultOptional();
  }

}
