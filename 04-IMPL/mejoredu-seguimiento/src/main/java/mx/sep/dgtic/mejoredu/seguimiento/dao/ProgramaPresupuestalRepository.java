package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.ProgramaPresupuestal;

@ApplicationScoped
public class ProgramaPresupuestalRepository implements PanacheRepositoryBase<ProgramaPresupuestal, Integer> {
	public List<ProgramaPresupuestal> findByAnho(Integer anho) {
		return find("idAnhio = ?1", anho).list();
	}

	public Optional<ProgramaPresupuestal> findByAnhoPlaneacionAndTipoPrograma(Integer anhoPlaneacion,
			Integer tipoPrograma) {
		return find("idAnhio = ?1 and idTipoPrograma = ?2", anhoPlaneacion, tipoPrograma).firstResultOptional();
	}
}
