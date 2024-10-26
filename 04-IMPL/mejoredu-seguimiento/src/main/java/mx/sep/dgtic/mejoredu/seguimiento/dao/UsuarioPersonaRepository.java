package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Usuario;
import mx.sep.dgtic.mejoredu.seguimiento.entity.UsuarioPersona;

@ApplicationScoped
public class UsuarioPersonaRepository implements PanacheRepositoryBase<UsuarioPersona, Integer>{
    public UsuarioPersona findByCveUsuario (Usuario usuario) {
        return  find("usuario", usuario).firstResult();
    }
}
