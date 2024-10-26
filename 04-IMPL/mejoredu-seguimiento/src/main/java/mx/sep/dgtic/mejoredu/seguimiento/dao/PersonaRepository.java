package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Persona;

import java.util.Optional;

@ApplicationScoped
public class PersonaRepository implements PanacheRepositoryBase<Persona, Integer>{
    public Optional<Persona> findByName (String nombre) {
        return  find("cxNombre", nombre).firstResultOptional();
    }


}
