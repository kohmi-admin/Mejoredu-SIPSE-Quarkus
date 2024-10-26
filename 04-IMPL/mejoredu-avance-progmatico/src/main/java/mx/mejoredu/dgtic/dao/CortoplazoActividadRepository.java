package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.ActividadEstatusProgramatico;
import mx.mejoredu.dgtic.entity.CortoplazoActividad;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

@ApplicationScoped
public class CortoplazoActividadRepository implements PanacheRepositoryBase<CortoplazoActividad, Integer> {
  @ConfigProperty(name = "solicitud.estatus.aprobado")
  private Integer estatusAprobado;

  public List<CortoplazoActividad> findActividades(int idProyecto, Integer trimestre) {
    return find("""
        SELECT a FROM CortoplazoActividad a
          JOIN a.proyecto p
          LEFT JOIN FETCH a.revisionTrimestral r
          LEFT JOIN VtProductoTrimestre as vt_producto_trimestre
            ON a.idActividad = vt_producto_trimestre.idActividad
        
          LEFT JOIN a.adecuacionActividad modificacion
            ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != 2242
          LEFT JOIN a.adecuacionActividadReferencia referencia
            ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id in (?3,2243)
        WHERE
          modificacion IS NULL
          AND referencia IS NULL
        
          AND p.idProyecto = ?1
          AND (vt_producto_trimestre.id.ixTrimestre = ?2 OR ?2 IS NULL)
        """, idProyecto, trimestre, estatusAprobado).list();
  }

  public List<CortoplazoActividad> findActividadesByAnhio(int anhio) {
    return find("""
        SELECT a FROM CortoplazoActividad a
          JOIN a.proyecto p
        
          LEFT JOIN a.adecuacionActividad modificacion
            ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?2
          LEFT JOIN a.adecuacionActividadReferencia referencia
            ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?2
        WHERE
          modificacion IS NULL
          AND referencia IS NULL
        
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.csEstatus = 'O'
          AND a.csEstatus = 'C'
        """, anhio, estatusAprobado).list();
  }

  public List<CortoplazoActividad> findActividadesByAnhio(int anhio, int trimestre) {
    return find("""
        SELECT a FROM CortoplazoActividad a
          JOIN a.proyecto p
          INNER JOIN FETCH a.producto producto
          INNER JOIN FETCH producto.productoCalendario productoCalendario
        
          LEFT JOIN a.adecuacionActividad modificacion
            ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
          LEFT JOIN a.adecuacionActividadReferencia referencia
            ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
        WHERE
          modificacion IS NULL
          AND referencia IS NULL
        
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.csEstatus = 'O'
          AND a.csEstatus = 'C'
          AND (CAST(CEIL(productoCalendario.ciMes / 3) AS INTEGER) = ?2)
        """, anhio, trimestre, estatusAprobado).list();
  }

  public List<CortoplazoActividad> findActividadesByAnhioAndUnidad(int anhio, int idUnidad) {
    return find("""
        SELECT a FROM CortoplazoActividad a
          JOIN a.proyecto p

          LEFT JOIN a.adecuacionActividad modificacion
            ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
          LEFT JOIN a.adecuacionActividadReferencia referencia
            ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
        WHERE
          modificacion IS NULL
          AND referencia IS NULL
        
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.unidadAdministrativa.id = ?2
          AND p.csEstatus = 'O'
          AND a.csEstatus = 'C'
        """, anhio, idUnidad, estatusAprobado).list();
  }

  public List<ActividadEstatusProgramatico> findActividadesEstatusProgramatico(int idProyecto, Integer trimestre) {
    return find("""
        SELECT
          unidad.id,
          unidad.ccExternaDos,
          unidad.ccExterna,
          actividad.idActividad,
          actividad.cveActividad,
          actividad.cxNombreActividad,
          vt_producto_trimestre.id.idProducto,
          MIN(CAST(vt_producto_trimestre.productosEntregados AS INTEGER)),
          SUM(vt_producto_trimestre.entregablesProgramados),
          SUM(vt_producto_trimestre.entregablesFinalizados),
          SUM(vt_producto_trimestre.presupuesto),
          SUM(vt_producto_trimestre.presupuestoUtilizado),
          COUNT(DISTINCT referencia.idAdecuacionActividad),
          SUM(vt_producto_trimestre.adecuacionesAcciones),
          SUM(vt_producto_trimestre.adecuacionesPresupuesto)
        FROM CortoplazoActividad actividad
        INNER JOIN actividad.proyecto proyecto
        LEFT JOIN proyecto.unidadAdministrativa as unidad
        LEFT JOIN VtProductoTrimestre as vt_producto_trimestre
          ON actividad.idActividad = vt_producto_trimestre.idActividad
        LEFT JOIN Producto producto
          ON vt_producto_trimestre.id.idProducto = producto.idProducto
        
        LEFT JOIN actividad.adecuacionActividad modificacion
          ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
        LEFT JOIN actividad.adecuacionActividadReferencia referencia
          ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
        
        LEFT JOIN AdecuacionProducto modificacionProducto
          ON (
            modificacionProducto.idProductoModificacion = vt_producto_trimestre.id.idProducto
            AND modificacionProducto.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
          )
        LEFT JOIN AdecuacionProducto referenciaProducto
          ON (
            referenciaProducto.idProductoReferencia = vt_producto_trimestre.id.idProducto
            AND referenciaProducto.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
          )
        
        WHERE
          modificacion IS NULL
          AND referencia IS NULL
        
          AND modificacionProducto IS NULL
          AND referenciaProducto IS NULL
        
          AND proyecto.idProyecto = ?1
          AND proyecto.csEstatus not in ('B', 'I')
          AND actividad.csEstatus not in ('B', 'I')
          AND producto.csEstatus = 'C'
          AND (vt_producto_trimestre.id.ixTrimestre = ?2 OR ?2 IS NULL)
        GROUP BY
          actividad.idActividad,
          vt_producto_trimestre.id.idProducto,
          unidad.id
        """, idProyecto, trimestre, estatusAprobado)
        .project(ActividadEstatusProgramatico.class)
        .list();
  }
}
