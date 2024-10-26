package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.Arbol;

import java.util.Optional;

@ApplicationScoped
public class ArbolRepository implements PanacheRepositoryBase<Arbol, Integer> {
  public Optional<Arbol> consultarPorPrograma(int idProgramaPresupuestal, int ixTipo) {
    return find("idPresupuestal = ?1 and ixTipo = ?2", idProgramaPresupuestal, ixTipo).firstResultOptional();
  }
}
