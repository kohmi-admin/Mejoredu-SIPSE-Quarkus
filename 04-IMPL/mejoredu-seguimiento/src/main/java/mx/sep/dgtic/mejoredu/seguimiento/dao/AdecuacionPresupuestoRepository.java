package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionPresupuesto;

import java.util.Optional;

@ApplicationScoped
public class AdecuacionPresupuestoRepository implements PanacheRepositoryBase<AdecuacionPresupuesto, Integer> {
  public Optional<AdecuacionPresupuesto> findByIdAdecuacionSolicitudAlta(int idAdecuacionSolicitud) {
    return find("""
        SELECT ap FROM AdecuacionPresupuesto ap
        JOIN FETCH ap.presupuestoModificacion
        WHERE ap.idAdecuacionSolicitud = ?1
        AND ap.idPresupuestoModificacion IS NOT NULL
        AND ap.idPresupuestoReferencia IS NULL
        """, idAdecuacionSolicitud).firstResultOptional();
  }

  public Optional<AdecuacionPresupuesto> findByIdAdecuacionSolicitudModificacion(int idAdecuacionSolicitud, int idPresupuestoReferencia) {
    return find("""
        SELECT ap FROM AdecuacionPresupuesto ap
        JOIN FETCH ap.presupuestoModificacion
        WHERE ap.idAdecuacionSolicitud = ?1
        AND ap.idPresupuestoModificacion IS NOT NULL
        AND ap.idPresupuestoReferencia = ?2
        """, idAdecuacionSolicitud, idPresupuestoReferencia)
        .firstResultOptional();
  }

  public Optional<AdecuacionPresupuesto> findByIdAdecuacionSolicitudCancelacion(int idAdecuacionSolicitud, int idPresupuestoReferencia) {
    return find("""
        SELECT ap FROM AdecuacionPresupuesto ap
        WHERE ap.idAdecuacionSolicitud = ?1
        AND ap.idPresupuestoModificacion IS NULL
        AND ap.idPresupuestoReferencia = ?2
        """, idAdecuacionSolicitud, idPresupuestoReferencia)
        .firstResultOptional();
  }
}
