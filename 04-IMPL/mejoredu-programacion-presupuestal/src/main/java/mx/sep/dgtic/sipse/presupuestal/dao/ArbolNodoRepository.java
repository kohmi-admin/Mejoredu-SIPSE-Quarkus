package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.ArbolNodo;

import java.util.List;

@ApplicationScoped
public class ArbolNodoRepository implements PanacheRepositoryBase<ArbolNodo, Integer> {
  public List<ArbolNodo> findTreeRoots(int idArbol) {
    return find("idArbol = ?1 and idNodoPadre is null", idArbol).list();
  }
}
