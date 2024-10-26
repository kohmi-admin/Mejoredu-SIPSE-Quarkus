package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SeguimientoMirProjection;
import mx.sep.dgtic.mejoredu.seguimiento.entity.VtSeguimientoMir;
import mx.sep.dgtic.mejoredu.seguimiento.entity.VtSeguimientoMirPK;

@ApplicationScoped
public class VtSeguimientoMirRepository implements PanacheRepositoryBase<VtSeguimientoMir, VtSeguimientoMirPK> {

	public List<VtSeguimientoMir> findByAnhioAndMeses(Integer anhio) {
		return list("idAnhio = ?1", anhio);
	}
}
