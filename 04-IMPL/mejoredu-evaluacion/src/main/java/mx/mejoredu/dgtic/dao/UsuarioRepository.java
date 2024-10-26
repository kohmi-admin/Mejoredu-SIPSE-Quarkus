package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Usuario;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepositoryBase<Usuario, String> {
}
