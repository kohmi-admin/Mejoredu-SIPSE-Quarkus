package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.PeriodoHabilitacion;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.TipoUsuario;

import java.util.List;

@ApplicationScoped
public class PeriodosHabilitacionRepository implements PanacheRepositoryBase<PeriodoHabilitacion, Integer> {
    public List<PeriodoHabilitacion> findByEstatus(String estatus) {
        return find("csEstatus", estatus).list();
    }

}
