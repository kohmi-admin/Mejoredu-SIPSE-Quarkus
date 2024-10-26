package mx.sep.dgtic.mejoredu.seguimiento.dao;

import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionProyecto;

import java.util.List;

@ApplicationScoped
public class AdecuacionProyectoRepository implements PanacheRepositoryBase<AdecuacionProyecto, Integer> {
  public List<AdecuacionProyecto> findAltaByIdSolicitud(int idSolicitud) {
    return list("SELECT ap FROM AdecuacionProyecto ap INNER JOIN ap.adecuacionSolicitud ads " +
            "INNER JOIN ads.solicitud s WHERE ap.idProyectoModificacion IS NOT NULL AND ap.idProyectoReferencia IS NULL " +
            "AND s.idSolicitud = ?1", idSolicitud);
  }
}
