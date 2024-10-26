package mx.mejoredu.dgtic.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import mx.mejoredu.dgtic.entity.Proyecto;
import mx.mejoredu.dgtic.entity.ProyectosEstatusProgramatico;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class ProyectoAnualRepository implements PanacheRepositoryBase<Proyecto, Integer> {
  @ConfigProperty(name = "solicitud.estatus.aprobado")
  private Integer estatusAprobado;

  public List<Proyecto> findPAA(int idAnhio, int idCatalogoUnidad) {
    return find("""
        SELECT p FROM Proyecto p
        WHERE
            p.anhoPlaneacion.idAnhio = ?1
            AND p.csEstatus = 'O'
            AND p.unidadAdministrativa.id = ?2
        """, idAnhio, idCatalogoUnidad).list();
  }

  public List<Proyecto> findPAA(int idAnhio, int idCatalogoUnidad, Integer trimestre) {
    return find("""
        SELECT p FROM Proyecto p
        LEFT JOIN FETCH p.actividad as actividad
        LEFT JOIN VtProductoTrimestre as vt_producto_trimestre
            ON actividad.idActividad = vt_producto_trimestre.idActividad
            AND vt_producto_trimestre.entregablesProgramados > 0
        LEFT JOIN FETCH actividad.revisionTrimestral as revisionTrimestal
        
        LEFT JOIN p.adecuacionProyecto modificacion
            ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id in (?4,2243)
        LEFT JOIN p.adecuacionProyectoReferencia referencia
            ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id in (?4,2243)
        
        WHERE
            modificacion IS NULL
            AND referencia IS NULL
        
            AND p.anhoPlaneacion.idAnhio = ?1
            AND p.csEstatus = 'O'
            AND p.unidadAdministrativa.id = ?2
            AND (
              vt_producto_trimestre.id.ixTrimestre = ?3
              OR (?3 IS NULL AND vt_producto_trimestre.id.ixTrimestre IN (1,2,3,4))
            )
        """, idAnhio, idCatalogoUnidad, trimestre, estatusAprobado).list();
  }

  public List<Proyecto> findPAATrimestre(int idAnhio, Integer trimestre) {
    return find("""
        SELECT p FROM Proyecto p
        LEFT JOIN FETCH p.actividad as actividad
        LEFT JOIN VtProductoTrimestre as vt_producto_trimestre
            ON actividad.idActividad = vt_producto_trimestre.idActividad
            AND vt_producto_trimestre.entregablesProgramados > 0
        LEFT JOIN FETCH actividad.revisionTrimestral as revisionTrimestal
        
        LEFT JOIN p.adecuacionProyecto modificacion
            ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
        LEFT JOIN p.adecuacionProyectoReferencia referencia
            ON referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
        
        WHERE
            modificacion IS NULL
            AND referencia IS NULL
        
            AND p.anhoPlaneacion.idAnhio = ?1
            AND p.csEstatus = 'O'
            AND (
              vt_producto_trimestre.id.ixTrimestre = ?2
              OR (?2 IS NULL AND vt_producto_trimestre.id.ixTrimestre IN (1,2,3,4))
            )
        """, idAnhio, trimestre, estatusAprobado).list();
  }

  public List<ProyectosEstatusProgramatico> findEstatusProgramatico(
      Integer anhio,
      Integer trimestre,
      Integer idUnidad,
      Integer idProyecto,
      Integer idActividad,
      Integer tipoAdecuacion
  ) {
    return find("""
        SELECT
            proyecto.idProyecto,
            anhoPlaneacion.idAnhio,
            unidad.id,
            unidad.ccExterna,
            unidad.ccExternaDos,
            proyecto.cveProyecto,
            proyecto.cxNombreProyecto,
            COUNT(DISTINCT referencia.idAdecuacionProyecto),
            actividad.idActividad,
            COUNT(DISTINCT referenciaActividad.idAdecuacionActividad),
            vt_producto_trimestre.id.idProducto,
            MIN(CAST(vt_producto_trimestre.productosEntregados AS INTEGER)),
            SUM(vt_producto_trimestre.entregablesProgramados),
            SUM(vt_producto_trimestre.entregablesFinalizados),
            SUM(vt_producto_trimestre.presupuesto),
            SUM(vt_producto_trimestre.presupuestoUtilizado),
            SUM(vt_producto_trimestre.adecuacionesAcciones),
            SUM(vt_producto_trimestre.adecuacionesPresupuesto)
        FROM Proyecto proyecto
            LEFT JOIN proyecto.anhoPlaneacion as anhoPlaneacion
            LEFT JOIN proyecto.unidadAdministrativa as unidad
            LEFT JOIN CortoplazoActividad as actividad
                ON proyecto.idProyecto = actividad.idProyecto

            LEFT JOIN VtProductoTrimestre as vt_producto_trimestre
                ON actividad.idActividad = vt_producto_trimestre.idActividad
                AND vt_producto_trimestre.entregablesProgramados IS NOT NULL
            LEFT JOIN Producto producto
                ON vt_producto_trimestre.id.idProducto = producto.idProducto

            LEFT JOIN proyecto.adecuacionProyecto modificacion
                ON modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != 2242
            LEFT JOIN proyecto.adecuacionProyectoReferencia referencia
                ON (referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id in (?6,2243) or referencia.idProyectoReferencia is null)
        
            LEFT JOIN actividad.adecuacionActividad modificacionActividad
                ON modificacionActividad.adecuacionSolicitud.solicitud.estatusCatalogo.id != 2242
            LEFT JOIN actividad.adecuacionActividadReferencia referenciaActividad
                ON referenciaActividad.adecuacionSolicitud.solicitud.estatusCatalogo.id in (?6,2243)
        
            LEFT JOIN AdecuacionProducto modificacionProducto
                ON (
                  modificacionProducto.idProductoModificacion = vt_producto_trimestre.id.idProducto
                  AND modificacionProducto.adecuacionSolicitud.solicitud.estatusCatalogo.id != 2242
                )
            LEFT JOIN AdecuacionProducto referenciaProducto
                ON (
                  referenciaProducto.idProductoReferencia = vt_producto_trimestre.id.idProducto
                  AND referenciaProducto.adecuacionSolicitud.solicitud.estatusCatalogo.id in (?6,2243)
                )
        WHERE
            anhoPlaneacion.idAnhio = ?1
            AND (
              vt_producto_trimestre.id.ixTrimestre = ?2
              OR (?2 IS NULL AND vt_producto_trimestre.id.ixTrimestre IN (1,2,3,4))
            )
            AND (unidad.id = ?3 OR ?3 IS NULL)
            AND (proyecto.idProyecto = ?4 OR ?4 IS NULL)
            AND (actividad.idActividad = ?5 OR ?5 IS NULL)
            AND proyecto.csEstatus = 'O'
            AND actividad.csEstatus NOT IN ('B', 'I')
            AND producto.csEstatus = 'C'
        GROUP BY
          proyecto.idProyecto,
          actividad.idActividad,
          vt_producto_trimestre.id.idProducto,
          anhoPlaneacion.idAnhio,
          unidad.id
        """, anhio, trimestre, idUnidad, idProyecto, idActividad, estatusAprobado)
        .project(ProyectosEstatusProgramatico.class).list();
  }
}
