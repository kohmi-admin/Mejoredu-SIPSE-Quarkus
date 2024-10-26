package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.PresupuestalJustificacion;

@ApplicationScoped
public class PresupuestalJustificacionRepository implements PanacheRepositoryBase<PresupuestalJustificacion, Integer> {

	public Optional<PresupuestalJustificacion> findByIdFichaIndicadores(Integer idFichaIndicadores) {
		return find("fichaIndicadores.idFichaIndicadores", idFichaIndicadores).firstResultOptional();
	}

}