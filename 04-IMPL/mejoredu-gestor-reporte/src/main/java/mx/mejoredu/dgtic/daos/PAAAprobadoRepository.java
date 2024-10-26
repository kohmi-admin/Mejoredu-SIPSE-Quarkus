package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.PAAAprobado;

@ApplicationScoped
public class PAAAprobadoRepository implements PanacheRepositoryBase<PAAAprobado, Integer>{

}
