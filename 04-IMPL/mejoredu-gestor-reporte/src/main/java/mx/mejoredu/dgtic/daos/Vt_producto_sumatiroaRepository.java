package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.vt_producto_sumatiroa;

@ApplicationScoped
public class Vt_producto_sumatiroaRepository implements PanacheRepositoryBase<vt_producto_sumatiroa, Integer> {
}
