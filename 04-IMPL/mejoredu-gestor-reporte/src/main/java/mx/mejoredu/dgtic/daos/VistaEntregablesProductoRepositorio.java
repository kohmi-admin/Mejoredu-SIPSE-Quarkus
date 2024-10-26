package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.VistaEntregablesProducto;


@ApplicationScoped
public class VistaEntregablesProductoRepositorio implements PanacheRepositoryBase<VistaEntregablesProducto, Integer>{

}
