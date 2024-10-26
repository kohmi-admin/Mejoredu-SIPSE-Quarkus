package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SolicitudComentario;

@ApplicationScoped
public class SolicitudComentarioRepository implements PanacheRepositoryBase<SolicitudComentario, Integer> {

	public List<SolicitudComentario> findComentariosByIdSolicitud(Integer idSolicitud) {
		return find("solicitud.idSolicitud = ?1", idSolicitud).list();

	}
}
