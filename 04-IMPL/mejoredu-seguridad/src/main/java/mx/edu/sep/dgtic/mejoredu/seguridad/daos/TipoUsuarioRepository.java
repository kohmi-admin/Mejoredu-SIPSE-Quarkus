package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.TipoUsuario;

import java.util.List;

@ApplicationScoped
public class TipoUsuarioRepository implements PanacheRepositoryBase<TipoUsuario, Integer> {

	public TipoUsuario findByName(String name){
	       return find("cdTipoUsuario", name).firstResult();
	   }
	public List<TipoUsuario> findByEstatus(String estatus) {
		return find("csEstatus", estatus).list();
	}
}
