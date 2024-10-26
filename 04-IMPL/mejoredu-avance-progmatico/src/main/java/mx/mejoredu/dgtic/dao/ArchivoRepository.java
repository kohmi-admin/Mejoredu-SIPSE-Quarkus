package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Archivo;


@ApplicationScoped
public class ArchivoRepository implements PanacheRepositoryBase<Archivo, Integer> {
    public Archivo findByNombre(String cxNombre) {
        return find("cxNombre", cxNombre).firstResult();
    }
    public Archivo findByCveUsuario(String usuario) {
        return find("usuario", usuario).firstResult();
    }
}
