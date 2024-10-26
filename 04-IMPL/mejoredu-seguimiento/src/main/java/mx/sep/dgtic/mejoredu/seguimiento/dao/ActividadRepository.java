package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Actividad;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class ActividadRepository implements PanacheRepositoryBase<Actividad, Integer> {
  @ConfigProperty(name = "solicitud.estatus.aprobado")
  private Integer estatusAprobado;

  public List<Actividad> consultarPorIdProyecto(int idProyecto) {
    return find("proyectoAnual.idProyecto", idProyecto).list();
  }

  public List<Actividad> consultarActivasPorProyecto(int idProyecto) {
    return find("proyectoAnual.idProyecto = ?1 and csEstatus in ('C','I')", idProyecto).list();
  }

  public List<Actividad> consultarActivasPorProyectoSolicitud(int idProyecto, boolean excluirCortoPlazo, int idSolicitud) {
    if (excluirCortoPlazo) return list("""
      SELECT a FROM Actividad a
      
      INNER JOIN a.adecuacionActividad modificacion
        ON modificacion.adecuacionSolicitud.solicitud.idSolicitud = ?2
      LEFT JOIN a.adecuacionActividadReferencia referencia
        ON referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
      
      WHERE
        a.proyectoAnual.idProyecto = ?1
        AND a.csEstatus IN ('C','I')
      
        AND referencia IS NULL
      """, idProyecto, idSolicitud);

    return list("""
    SELECT a FROM Actividad a
    
    LEFT JOIN a.adecuacionActividad modificacion
      ON (
        modificacion.adecuacionSolicitud.solicitud.idSolicitud != ?2
        AND modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
      )
    LEFT JOIN a.adecuacionActividadReferencia referencia
      ON (
        referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
        OR referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
      )
    
    WHERE
      a.proyectoAnual.idProyecto = ?1
      AND a.csEstatus IN ('C','I')
    
      AND modificacion IS NULL
      AND referencia IS NULL
    """, idProyecto, idSolicitud, estatusAprobado);
  }
}
