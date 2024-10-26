package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Proyecto;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;


@ApplicationScoped
public class ProyectoAnualRepository implements PanacheRepositoryBase<Proyecto, Integer> {
  @ConfigProperty(name = "solicitud.estatus.aprobado")
  private Integer estatusAprobado;

  public Proyecto findByNombre(String nombre) {
    return find("cxNombreProyecto = ?1 and csEstatus != 'B'", nombre).firstResult();
  }

  public List<Proyecto> findByAnhioAndCsEstatus(int idAnhio, List<String> csEstatus) {
    return find("anhoPlaneacion.idAnhio = ?1 AND csEstatus IN ?2", idAnhio, csEstatus).list();
  }

  public List<Proyecto> findByAnhioAndCsEstatusOnlyAdecuaciones(Integer idAnhio, List<String> csEstatus) {
    // fetch inner join p.adecuaciones a
    return find("anhoPlaneacion.idAnhio = ?1 AND csEstatus IN ?2 AND itSemantica = 2", idAnhio, csEstatus).list();
  }

  public List<Proyecto> findByAnhioAndCsEstatusOnlyWithoutAdecuaciones(Integer idAnhio, List<String> csEstatus) {
    // LEFT JOIN FETCH p.adecuaciones a WHERE a.idAdecuacion IS NULL
    return find("anhoPlaneacion.idAnhio = ?1 AND csEstatus IN ?2 AND itSemantica = 1", idAnhio, csEstatus).list();
  }

  public List<Proyecto> findByAnhioAndEstatus(Integer idAnhio, List<String> csEstatus, boolean excluirCortoPlazo, Integer idSolicitud) {
    if (excluirCortoPlazo) return list("""
      SELECT p FROM Proyecto p
      INNER JOIN p.adecuacionProyecto modificacion
        ON modificacion.adecuacionSolicitud.solicitud.idSolicitud = ?3
      LEFT JOIN p.adecuacionProyectoReferencia referencia
        ON referencia.adecuacionSolicitud.solicitud.idSolicitud = ?3
      
      LEFT JOIN FETCH p.proyectoContribucion
      LEFT JOIN FETCH p.archivo
      WHERE
        p.anhoPlaneacion.idAnhio = ?1
        AND p.csEstatus IN ?2
      
        AND referencia IS NULL
      """, idAnhio, csEstatus, idSolicitud);

    return list("""
      SELECT p FROM Proyecto p
      
      LEFT JOIN p.adecuacionProyecto modificacion
        ON (
          modificacion.adecuacionSolicitud.solicitud.idSolicitud != ?3
          AND modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?4
        )
      
      LEFT JOIN p.adecuacionProyectoReferencia referencia
        ON (
          referencia.adecuacionSolicitud.solicitud.idSolicitud = ?3
          OR referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?4
        )
      
      LEFT JOIN FETCH p.proyectoContribucion
      LEFT JOIN FETCH p.archivo
      WHERE
        p.anhoPlaneacion.idAnhio = ?1
        AND p.csEstatus IN ?2
      
        AND modificacion IS NULL
        AND referencia IS NULL
      """, idAnhio, csEstatus, idSolicitud, estatusAprobado);
  }

}
