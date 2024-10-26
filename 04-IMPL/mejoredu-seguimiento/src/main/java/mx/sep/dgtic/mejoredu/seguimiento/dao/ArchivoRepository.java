package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Archivo;

@ApplicationScoped
public class ArchivoRepository implements PanacheRepositoryBase<Archivo, Integer> {
	public Archivo findByNombre(String cxNombre) {
		return find("nombre", cxNombre).firstResult();
	}

	public Archivo findByCveUsuario(String usuario) {
		return find("usuario", usuario).firstResult();
	}
}
