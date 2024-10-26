package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.VistaProyectoEntity;

@ApplicationScoped
public class VistaProyectoRepository implements PanacheRepositoryBase<VistaProyectoEntity, Integer>{


}
