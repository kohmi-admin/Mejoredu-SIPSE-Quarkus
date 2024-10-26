package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionProducto;

import java.util.List;

@ApplicationScoped
public class AdecuacionProductoRepository implements PanacheRepositoryBase<AdecuacionProducto, Integer> {
  public List<AdecuacionProducto> findAltaByIdSolicitud(int idSolicitud) {
    return list("SELECT ap FROM AdecuacionProducto ap INNER JOIN ap.adecuacionSolicitud ads " +
            "INNER JOIN ads.solicitud s WHERE ap.idProductoModificacion IS NOT NULL AND ap.idProductoReferencia IS NULL " +
            "AND s.idSolicitud = ?1", idSolicitud);
  }
}
