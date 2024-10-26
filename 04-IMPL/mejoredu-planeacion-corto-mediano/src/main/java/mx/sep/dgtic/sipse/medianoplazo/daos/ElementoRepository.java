package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Elemento;

import java.util.List;

@ApplicationScoped
public class ElementoRepository implements PanacheRepositoryBase<Elemento, Integer>{
  // Find Elements by id_proyecto JOIN through ProyectoContribucion
  public List<Elemento> findByIdProyecto(Integer idProyecto) {
    return find("""
    SELECT e FROM met_mp_elemento e
    JOIN ProyectoContribucion pc
    ON e.objetivo.idCatalogo = pc.idCatalogoContribucion
    WHERE
      pc.idProyecto = ?1
      AND pc.ixTipoContribucion = 1
      AND e.meta.ixTipo = 2
    """, idProyecto).list();
  }

  // Find Elements by id_actividad JOIN through EstrategiaAccion
  public List<Elemento> findByIdActividad(Integer idActividad) {
    return find("""
    SELECT e FROM met_mp_elemento e
    JOIN EstrategiaAccion ea
    ON e.objetivo.idCatalogo = ea.idCatalogo
    WHERE
      ea.idActividad = ?1
      AND ea.ixTipo = 3
      AND e.meta.ixTipo = 2
    """, idActividad).list();
  }
}
