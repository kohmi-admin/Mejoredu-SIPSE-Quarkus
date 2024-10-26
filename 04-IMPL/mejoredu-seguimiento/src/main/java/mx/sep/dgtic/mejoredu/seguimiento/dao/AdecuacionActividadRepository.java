package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionActividad;

import java.util.List;

@ApplicationScoped
public class AdecuacionActividadRepository implements PanacheRepositoryBase<AdecuacionActividad, Integer> {
  public List<AdecuacionActividad> findAltaByIdSolicitud(int idSolicitud) {
    return list("SELECT aa FROM AdecuacionActividad aa INNER JOIN aa.adecuacionSolicitud ads " +
            "INNER JOIN ads.solicitud s WHERE aa.idActividadModificacion IS NOT NULL AND aa.idActividadReferencia IS NULL " +
            "AND s.idSolicitud = ?1", idSolicitud);
  }
}
