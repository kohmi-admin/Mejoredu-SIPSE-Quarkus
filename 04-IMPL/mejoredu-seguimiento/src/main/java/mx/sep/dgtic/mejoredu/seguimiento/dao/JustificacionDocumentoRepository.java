package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.JustificacionDocumento;
import mx.sep.dgtic.mejoredu.seguimiento.entity.JustificacionDocumentoPK;

@ApplicationScoped
public class JustificacionDocumentoRepository
		implements PanacheRepositoryBase<JustificacionDocumento, JustificacionDocumentoPK> {

	public List<JustificacionDocumento> findByIdJustificacion(Integer idJustificacion) {
		return find("""
				SELECT j FROM JustificacionDocumento j
				WHERE j.justificacion.idJustificacion = ?1
				""", idJustificacion).list();
	}
}
