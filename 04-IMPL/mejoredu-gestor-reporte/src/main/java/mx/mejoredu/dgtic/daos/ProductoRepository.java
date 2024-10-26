package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.Producto;

import java.util.List;

@ApplicationScoped
public class ProductoRepository implements PanacheRepositoryBase<Producto, Integer> {
  public List<Producto> consultarActivosPorIdActividad(int idActividad) {
    return find("actividad.idActividad = ?1 and csEstatus in ('C','I')", idActividad).list();
  }
  public List<Producto> consultarPorIdActividad(int idActividad) {
	    return find("actividad.idActividad = ?1", idActividad).list();
	  }

}
