package mx.edu.sep.dgtic.mejoredu.catalogos.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.TipoUsuario;

@ApplicationScoped
public class TipoUsuarioRepositorio implements PanacheRepository<TipoUsuario> {

	public TipoUsuario findByName(String name){
	       return find("cdTipoUsuario", name).firstResult();
	   }
}
