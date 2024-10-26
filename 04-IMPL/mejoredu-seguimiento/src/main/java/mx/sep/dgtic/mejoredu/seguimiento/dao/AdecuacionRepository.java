package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionSolicitud;

@ApplicationScoped
public class AdecuacionRepository implements PanacheRepositoryBase<AdecuacionSolicitud, Integer> {

	public List<AdecuacionSolicitud> findByIdSolicitud(Integer idSolicitud) {
		return find("solicitud.idSolicitud = ?1", idSolicitud).list();
	}

	public void deleteByIdSolicitud(Integer idSolicitud) {
		delete("solicitud.idSolicitud = ?1", idSolicitud);
	}

	public Optional<AdecuacionSolicitud> findByIdAdecuacionSolictud(Integer idAdecuacionSolicitud) {
		return find("SELECT a FROM AdecuacionSolicitud a JOIN FETCH a.solicitud s WHERE a.idAdecuacionSolicitud = ?1", idAdecuacionSolicitud).firstResultOptional();
	}

}
