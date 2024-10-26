package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.EstrategiaPrioritaria;

@ApplicationScoped
public class EstrategiaPrioritariaRepository implements PanacheRepositoryBase<EstrategiaPrioritaria, Integer> {
}
