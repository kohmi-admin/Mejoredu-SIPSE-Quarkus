package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.Archivo;

@ApplicationScoped
public class ArchivoRepository implements PanacheRepositoryBase<Archivo, Integer> {
}
