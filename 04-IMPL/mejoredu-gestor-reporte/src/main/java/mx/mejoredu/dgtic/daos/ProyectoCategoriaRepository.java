package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.ProyectoPorcategoria;

@ApplicationScoped
public class ProyectoCategoriaRepository implements PanacheRepositoryBase<ProyectoPorcategoria, Integer>{

}
