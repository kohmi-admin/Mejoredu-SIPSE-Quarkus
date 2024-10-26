package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.Producto;
import mx.mejoredu.dgtic.entidades.ProductosAsociadosMIR;

import java.util.List;

@ApplicationScoped
public class ProductoAsociadosMIRRepository implements PanacheRepositoryBase<ProductosAsociadosMIR, Integer> {
}
