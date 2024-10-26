package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Presupuesto;

import java.util.List;

@ApplicationScoped
public class PresupuestoRepository implements PanacheRepositoryBase<Presupuesto, Integer> {
  public List<Presupuesto> consultarPorProducto(int idProducto) {
    return list("""
        SELECT p
        FROM Presupuesto p
        LEFT JOIN p.adecuacionAccion aa
        LEFT JOIN p.adecuacionPresupuesto ap
        WHERE
          aa.presupuestoModificacion IS NULL
          AND ap.presupuestoModificacion IS NULL
          AND p.producto.idProducto = ?1
        """, idProducto);
  }

  public List<Presupuesto> consultarActivosPorProducto(int idProducto) {
    return list("""
        SELECT p
        FROM Presupuesto p
        LEFT JOIN p.adecuacionAccion aa
        LEFT JOIN p.adecuacionPresupuesto ap
        WHERE
          aa.presupuestoModificacion IS NULL
          AND ap.presupuestoModificacion IS NULL
          AND p.producto.idProducto = ?1
          AND p.csEstatus IN ('C','I')
        """, idProducto);
  }

  public List<Presupuesto> consultarPorProductoEstatus(int idProducto, List<String> estatus) {
    return list("""
        SELECT p
        FROM Presupuesto p
        LEFT JOIN p.adecuacionAccion aa
        LEFT JOIN p.adecuacionPresupuesto ap
        WHERE
          aa.presupuestoModificacion IS NULL
          AND ap.presupuestoModificacion IS NULL
          AND p.producto.idProducto = ?1
          AND p.csEstatus IN ?2
        """, idProducto, estatus);
  }
}
