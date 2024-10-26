package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.ArchivoSeccion;

@ApplicationScoped
public class ArchivoSeccionRepository implements PanacheRepositoryBase<ArchivoSeccion, Integer> {
}
