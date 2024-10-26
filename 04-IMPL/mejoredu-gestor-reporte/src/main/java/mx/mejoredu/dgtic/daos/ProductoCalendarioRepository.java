package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.ProductoCalendario;
import mx.mejoredu.dgtic.entidades.ProductoCancelado;

import java.util.List;

@ApplicationScoped
public class ProductoCalendarioRepository implements PanacheRepositoryBase<ProductoCalendario, Integer> {
}
