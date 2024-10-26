package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.PresupuestoProyecto;

import java.util.List;

@ApplicationScoped
public class PresupuestoProyectoRepository implements PanacheRepositoryBase <PresupuestoProyecto, Integer> {
    public List<PresupuestoProyecto> consultaPorAnhio(int anhio) {
        return find("idAnhio = ?1 and idUnidad is not null", anhio).list();
    }
    public List<PresupuestoProyecto> consultaPorAnhioUnidad(int anhio, int unidad) {
        return find("idAnhio = ?1 and idUnidad = ?2", anhio, unidad).list();
    }
}
