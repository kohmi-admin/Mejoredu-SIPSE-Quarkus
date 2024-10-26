package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Contrasenhia;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Usuario;

import java.util.Optional;

@ApplicationScoped
public class ContrasenhiaRepository implements PanacheRepositoryBase<Contrasenhia, Integer>{
    public Contrasenhia findByCveUsuario(String usuario) {
        return find("usuario", usuario).firstResult();
    }
}
