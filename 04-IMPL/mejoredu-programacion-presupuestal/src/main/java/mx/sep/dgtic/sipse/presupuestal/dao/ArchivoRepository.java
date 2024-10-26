package mx.sep.dgtic.sipse.presupuestal.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.presupuestal.entity.Archivo;

import java.util.Optional;

@ApplicationScoped
public class ArchivoRepository implements PanacheRepositoryBase<Archivo, Integer> {
  public Optional<Archivo> consultarPorUUID(String uuid) {
    return find("cxUuid", uuid).firstResultOptional();
  }
}