package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Persona;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.UsuarioPersona;

import java.util.Optional;

@ApplicationScoped
public class PersonaRepository implements PanacheRepositoryBase<Persona, Integer>{
    public Optional<Persona> findByName (String nombre) {
        return  find("cxNombre", nombre).firstResultOptional();
    }


}
