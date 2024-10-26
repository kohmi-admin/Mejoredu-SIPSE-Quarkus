package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Justificacion;

@ApplicationScoped
public class JustificacionRepository implements PanacheRepositoryBase<Justificacion, Integer> {

	public Optional<Justificacion> findByIdIndicador(Integer idIndicador) {
		return find("""
				SELECT j FROM Justificacion j
				WHERE j.idIndicador = ?1
				""", idIndicador).firstResultOptional();
	}
}
