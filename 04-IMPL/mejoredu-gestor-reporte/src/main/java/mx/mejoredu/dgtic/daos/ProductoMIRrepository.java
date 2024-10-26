package mx.mejoredu.dgtic.daos;

import org.springframework.stereotype.Repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import mx.mejoredu.dgtic.entidades.ProductoMir;

@Repository
public class ProductoMIRrepository implements PanacheRepositoryBase<ProductoMir, Integer>{

}
