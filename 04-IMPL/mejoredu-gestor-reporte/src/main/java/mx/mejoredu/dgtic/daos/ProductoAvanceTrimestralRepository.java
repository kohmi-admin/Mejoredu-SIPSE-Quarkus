package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.ProductoAvance;
import mx.mejoredu.dgtic.entidades.ProductoAvanceTrimestre;

import java.util.List;

@ApplicationScoped
public class ProductoAvanceTrimestralRepository implements PanacheRepositoryBase<ProductoAvanceTrimestre, Integer> {

}
