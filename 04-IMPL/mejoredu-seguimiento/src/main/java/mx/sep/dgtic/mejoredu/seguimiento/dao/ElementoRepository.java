package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Elemento;

import java.util.List;

@ApplicationScoped
public class ElementoRepository implements PanacheRepositoryBase<Elemento, Integer> {
  public List<Elemento> findByIdProyecto(Integer idProyecto) {
    return find("""
    SELECT e FROM Elemento e
    JOIN met_proyecto_contribucion pc
    ON e.objetivo.id = pc.contribucion.id
    WHERE
      pc.proyectoAnual.idProyecto = ?1
      AND pc.ixTipoContri = 1
      AND e.meta.ixTipo = 2
    """, idProyecto).list();
  }
}
