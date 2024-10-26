package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Producto;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductoRepository implements PanacheRepositoryBase<Producto, Integer> {
  @ConfigProperty(name = "solicitud.estatus.aprobado")
  private Integer estatusAprobado;

  public Optional<Producto> consultaProductoPorId(int idProducto) {
    return  find("idProducto = ?1", idProducto).firstResultOptional();
  }

  public List<Producto> findProductos(int idActividad, Integer trimestre) {
    return find("""
      SELECT p FROM Producto p
        JOIN p.actividad a
        JOIN p.productoCalendario pc
      
        LEFT JOIN p.adecuacionProducto modificacion
          ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
        LEFT JOIN p.adecuacionProductoReferencia referencia
          ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
      WHERE
        modificacion IS NULL
        AND referencia IS NULL
      
        AND a.idActividad = ?1
        AND p.csEstatus = 'C'
        AND (CAST(CEIL(pc.ciMes / 3) AS INTEGER) = ?2 OR ?2 IS NULL)
      """, idActividad, trimestre, estatusAprobado).list();
  }

  public List<Producto> findProductosEstatusProgramatico(Integer idActividad, Integer trimestre) {
    return find("""
      SELECT producto FROM Producto producto
        INNER JOIN FETCH producto.actividad actividad
        INNER JOIN FETCH actividad.proyecto proyecto
        LEFT JOIN FETCH producto.productoCalendario pc
        LEFT JOIN FETCH pc.avances av
        LEFT JOIN FETCH av.evidenciaTrimestral ev
        LEFT JOIN FETCH ev.tipoPublicacion tp
        LEFT JOIN FETCH ev.tipoDifusion td

        LEFT JOIN producto.adecuacionProducto modificacion
          ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
        LEFT JOIN producto.adecuacionProductoReferencia referencia
          ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3

      WHERE
        actividad.idActividad = ?1
        AND producto.csEstatus = 'C'
        AND (CAST(CEIL(pc.ciMes / 3) AS INTEGER) = ?2 OR ?2 IS NULL)
      
        AND modificacion IS NULL
        AND referencia IS NULL
      """, idActividad, trimestre, estatusAprobado).list();
  }

  public Optional<Producto> detailsById(int idProducto) {
    return find("""
        SELECT
                producto
        FROM Producto producto
            LEFT JOIN FETCH producto.categorizacion categorizacion
            LEFT JOIN FETCH producto.tipoProducto tipoProducto
        
            INNER JOIN FETCH producto.actividad actividad
            INNER JOIN FETCH actividad.proyecto proyecto
        
            LEFT JOIN FETCH producto.productoCalendario productoCalendario
        
            LEFT JOIN FETCH producto.presupuesto presupuesto
            LEFT JOIN FETCH presupuesto.partidaGastos partidaGastos
            LEFT JOIN FETCH partidaGastos.catalogoPartida catalogoPartida
            LEFT JOIN FETCH partidaGastos.presupuestoCalendarios presupuestoCalendarios
        
            LEFT JOIN FETCH producto.adecuacionProductoReferencia adecuacionProducto
        WHERE
                producto.idProducto = ?1
        """, idProducto).firstResultOptional();
  }
}
