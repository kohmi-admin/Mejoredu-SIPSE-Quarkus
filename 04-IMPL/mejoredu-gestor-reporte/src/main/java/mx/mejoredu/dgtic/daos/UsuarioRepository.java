package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.Usuario;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepositoryBase<Usuario, String> {
}
