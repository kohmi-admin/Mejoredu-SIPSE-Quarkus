package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.RequestScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.AnhoPlaneacion;

@RequestScoped
public class AnhioPlaneacionRepository implements PanacheRepositoryBase<AnhoPlaneacion, Integer> {

}
