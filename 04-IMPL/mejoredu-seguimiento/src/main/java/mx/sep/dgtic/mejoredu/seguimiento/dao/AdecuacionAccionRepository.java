package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionAccion;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class AdecuacionAccionRepository implements PanacheRepositoryBase<AdecuacionAccion, Integer> {
  public Optional<AdecuacionAccion> consultarPorIdAdecuacionSolicitudAlta(int idAdecuacionSolicitud) {
    return find("""
        SELECT aa FROM AdecuacionAccion aa
        JOIN FETCH aa.accionModificacion
        WHERE aa.idAdecuacionSolicitud = ?1
        AND aa.idAccionModificacion IS NOT NULL
        AND aa.idAccionReferencia IS NULL
      """, idAdecuacionSolicitud).firstResultOptional();
  }
  public Optional<AdecuacionAccion> consultarPorIdAdecuacionSolicitudModificacion(int idAdecuacionSolicitud, int idAccionReferencia) {
    return find("""
        SELECT aa FROM AdecuacionAccion aa
        JOIN FETCH aa.accionModificacion
        WHERE aa.idAdecuacionSolicitud = ?1
        AND aa.idAccionModificacion IS NOT NULL
        AND aa.idAccionReferencia = ?2
        """, idAdecuacionSolicitud, idAccionReferencia)
        .firstResultOptional();
  }

  public Optional<AdecuacionAccion> consultarPorIdAdecuacionSolicitudCancelacion(int idAdecuacionSolicitud, int idAccionReferencia) {
    return find("""
        SELECT aa FROM AdecuacionAccion aa
        WHERE aa.idAdecuacionSolicitud = ?1
        AND aa.idAccionModificacion IS NULL
        AND aa.idAccionReferencia = ?2
        """, idAdecuacionSolicitud, idAccionReferencia)
        .firstResultOptional();
  }

  public List<AdecuacionAccion> findAltaByIdSolicitud(int idSolicitud) {
    return list("SELECT aa FROM AdecuacionAccion aa INNER JOIN aa.adecuacionSolicitud ads " +
            "INNER JOIN ads.solicitud s WHERE aa.idAccionModificacion IS NOT NULL AND aa.idAccionReferencia IS NULL " +
            "AND s.idSolicitud = ?1", idSolicitud);
  }
}
