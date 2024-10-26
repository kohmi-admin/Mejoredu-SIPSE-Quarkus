package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Avance;
import mx.mejoredu.dgtic.entity.ProductoCalendario;

import java.util.List;
@ApplicationScoped
public class ProductoCalendarioRepository implements PanacheRepositoryBase<ProductoCalendario, Integer> {
    public List<ProductoCalendario> consultaProductoCalendarioPorTrimestre(int idProducto) {
        return find("idProducto = ?1", idProducto).list();
    }
}
