package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Usuario;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.UsuarioPersona;

@ApplicationScoped
public class UsuarioPersonaRepository implements PanacheRepositoryBase<UsuarioPersona, Integer>{
    public UsuarioPersona findByCveUsuario (String usuario) {
        return  find("usuario", usuario).firstResult();
    }
}
