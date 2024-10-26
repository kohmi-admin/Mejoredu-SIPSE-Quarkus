package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.Actividad;

import java.util.List;

@ApplicationScoped
public class ActividadRepository implements PanacheRepositoryBase<Actividad, Integer> {
  public List<Actividad> consultarPorIdProyecto(int idProyecto) {
    return find("proyectoAnual.idProyecto", idProyecto).list();
  }

  public List<Actividad> consultarActivasPorProyecto(int idProyecto) {
    return list("""
        SELECT a
        FROM Actividad a
        LEFT JOIN a.adecuacionActividad aa
        WHERE
          aa.actividadModificacion IS NULL
          AND a.proyectoAnual.idProyecto = ?1
          AND a.csEstatus IN ('C','I')
        """, idProyecto);
  }

  public List<Actividad> findAllByProyectoAndEstatus(int idProyecto, List<String> estatus) {
    return list("""
        SELECT a
        FROM Actividad a
        LEFT JOIN a.adecuacionActividad aa
        WHERE
          aa.actividadModificacion IS NULL
          AND a.proyectoAnual.idProyecto = ?1
          AND a.csEstatus IN ?2
        """, idProyecto, estatus);
  }

  public PanacheQuery<Actividad> findByCveActividadAndIdProyecto(int cveActividad, int idProyecto) {
    return find("""
        SELECT a
        FROM Actividad a
        LEFT JOIN a.adecuacionActividad aa
        WHERE
          aa.actividadModificacion IS NULL
          AND a.cveActividad = ?1
          AND a.proyectoAnual.idProyecto = ?2
        """, cveActividad, idProyecto);
  }
}
