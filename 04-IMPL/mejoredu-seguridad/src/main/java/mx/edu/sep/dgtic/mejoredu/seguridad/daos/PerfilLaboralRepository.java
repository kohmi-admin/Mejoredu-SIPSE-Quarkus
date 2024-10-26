package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.PerfilLaboral;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Usuario;

@ApplicationScoped
public class PerfilLaboralRepository implements PanacheRepositoryBase<PerfilLaboral, Integer> {
    public PerfilLaboral findByCveUsuario (String usuario) {
        return  find("usuario", usuario).firstResult();
    }
}
