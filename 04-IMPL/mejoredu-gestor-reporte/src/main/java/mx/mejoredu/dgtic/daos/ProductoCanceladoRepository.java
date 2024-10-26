package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.Producto;
import mx.mejoredu.dgtic.entidades.ProductoCancelado;

import java.util.List;

@ApplicationScoped
public class ProductoCanceladoRepository implements PanacheRepositoryBase<ProductoCancelado, Integer> {
    public List<ProductoCancelado> consultaProductosCancelados(int anhio) {
        return find("idCatalogoAnhio = ?1", anhio).list();
    }
}
