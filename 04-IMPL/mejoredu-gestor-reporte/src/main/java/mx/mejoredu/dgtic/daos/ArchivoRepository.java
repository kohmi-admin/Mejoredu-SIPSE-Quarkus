package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.Archivo;

@ApplicationScoped
public class ArchivoRepository implements PanacheRepositoryBase<Archivo, Integer> {
}
