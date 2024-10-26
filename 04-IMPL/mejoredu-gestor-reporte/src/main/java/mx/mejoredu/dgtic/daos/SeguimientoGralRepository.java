package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.ProductoAvance;
import mx.mejoredu.dgtic.entidades.ProductoAvanceGral;

import java.util.List;

@ApplicationScoped
public class SeguimientoGralRepository implements PanacheRepositoryBase<ProductoAvanceGral, Integer> {

}
