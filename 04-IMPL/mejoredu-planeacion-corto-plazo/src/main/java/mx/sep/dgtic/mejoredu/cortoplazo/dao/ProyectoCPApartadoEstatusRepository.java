package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.ProyectoCPApartadoEstatus;

@ApplicationScoped
public class ProyectoCPApartadoEstatusRepository implements PanacheRepositoryBase<ProyectoCPApartadoEstatus, Integer>{

}
