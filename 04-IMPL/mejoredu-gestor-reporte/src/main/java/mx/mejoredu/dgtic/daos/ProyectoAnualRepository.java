package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.ProyectoAnual;


@ApplicationScoped
public class ProyectoAnualRepository implements PanacheRepositoryBase<ProyectoAnual, Integer> {
    public ProyectoAnual findByNombre(String nombre) {
        return find("cxNombreProyecto = ?1 and csEstatus != 'B'", nombre).firstResult();
    }
}
