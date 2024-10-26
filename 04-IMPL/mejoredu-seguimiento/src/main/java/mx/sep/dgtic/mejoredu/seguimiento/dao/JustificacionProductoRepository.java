package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.JustificacionProducto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.JustificacionProductoPK;

@ApplicationScoped
public class JustificacionProductoRepository
		implements PanacheRepositoryBase<JustificacionProducto, JustificacionProductoPK> {

	public JustificacionProducto findByIdJustificacion(Integer idJustificacion) {
		return find("""
				SELECT j FROM JustificacionProducto j
				JOIN FETCH j.producto p
				WHERE j.id.idJustificacion = ?1
				""", idJustificacion).firstResult();
	}
}
