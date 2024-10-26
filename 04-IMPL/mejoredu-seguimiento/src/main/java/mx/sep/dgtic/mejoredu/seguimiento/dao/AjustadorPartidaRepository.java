package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AjustadorPartida;

@ApplicationScoped
public class AjustadorPartidaRepository implements PanacheRepositoryBase<AjustadorPartida, Integer>{

}
