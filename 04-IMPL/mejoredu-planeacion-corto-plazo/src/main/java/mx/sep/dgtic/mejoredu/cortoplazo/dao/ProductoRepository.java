package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Producto;

import java.util.List;

@ApplicationScoped
public class ProductoRepository implements PanacheRepositoryBase<Producto, Integer> {
  public List<Producto> consultarActivosPorIdActividad(int idActividad) {
    return list("""
        SELECT p
        FROM Producto p
        LEFT JOIN p.adecuacionProductoModificacion ap
        WHERE
          ap.productoModificacion IS NULL
          AND p.actividad.idActividad = ?1
          AND p.csEstatus IN ('C','I')
        """, idActividad);
  }

  public List<Producto> findByIdActividadAndEstatus(int idActividad, String estatus) {
    return list("""
        SELECT p
        FROM Producto p
        LEFT JOIN p.adecuacionProductoModificacion ap
        WHERE
          ap.productoModificacion IS NULL
          AND p.actividad.idActividad = ?1
          AND p.csEstatus = ?2
        """, idActividad, estatus);
  }

  public List<Producto> findByIdActividadAndEstatus(int idActividad, List<String> estatus) {
    return list("""
        SELECT p
        FROM Producto p
        LEFT JOIN p.adecuacionProductoModificacion ap
        WHERE
          ap.productoModificacion IS NULL
          AND p.actividad.idActividad = ?1
          AND p.csEstatus IN ?2
        """, idActividad, estatus);
  }
}
