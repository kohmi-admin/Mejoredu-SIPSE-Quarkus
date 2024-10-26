package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.Presupuesto;

import java.util.List;
@ApplicationScoped

public class PresupuestoRepository implements PanacheRepositoryBase<Presupuesto, Integer> {
    public List<Presupuesto> consultaPorCsEstatus(String csEstatus) {
        return find("csEstatus", csEstatus).list();
    }
}
