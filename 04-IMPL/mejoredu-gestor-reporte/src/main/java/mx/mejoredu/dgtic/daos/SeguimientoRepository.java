package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.ProductoAvance;

import java.util.List;

@ApplicationScoped
public class SeguimientoRepository implements PanacheRepositoryBase<ProductoAvance, Integer> {

    public List<ProductoAvance> consultaPorCsEstatus(String csEstatus) {
        return find("csEstatus = ?1", csEstatus).list();
    }
}
