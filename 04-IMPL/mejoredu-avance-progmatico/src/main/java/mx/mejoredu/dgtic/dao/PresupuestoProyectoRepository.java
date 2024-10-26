package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.PresupuestoProyecto;

import java.util.List;

/**
 * @author Emmanuel Estrada Gonzalez (emmanuel.estrada)
 * @version 1.0
 */
@ApplicationScoped
public class PresupuestoProyectoRepository implements PanacheRepositoryBase<PresupuestoProyecto, Integer> {
    public List<PresupuestoProyecto> consultaPorAnhioUnidad(int anhio, Integer cveUnidad) {
        return find("idAnhio = ?1 and idUnidad is not null and idUnidad = ?2", anhio).list();
    }
}
