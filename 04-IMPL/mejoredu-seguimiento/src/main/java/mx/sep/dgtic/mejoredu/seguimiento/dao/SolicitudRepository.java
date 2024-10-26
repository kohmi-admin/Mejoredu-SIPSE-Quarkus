package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Solicitud;

import java.util.List;
import java.util.Map;

@ApplicationScoped
public class SolicitudRepository implements PanacheRepositoryBase<Solicitud, Integer> {

  public List<Solicitud> findSolicitudes(String query, Map<String, Object> parameters) {
    var queryBuilder = """
            SELECT s
            FROM Solicitud s
            LEFT JOIN FETCH s.adecuaciones a
            LEFT JOIN FETCH a.productos ap
            LEFT JOIN FETCH ap.productoModificacion
            LEFT JOIN FETCH ap.productoReferencia
            WHERE %s
        """.formatted(query);

    Log.info(queryBuilder);


    return find(queryBuilder, parameters).list();
  }
}
