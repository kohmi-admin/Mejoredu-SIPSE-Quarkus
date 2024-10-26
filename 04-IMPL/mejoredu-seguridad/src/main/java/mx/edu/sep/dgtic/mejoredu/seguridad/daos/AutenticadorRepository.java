package mx.edu.sep.dgtic.mejoredu.seguridad.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Autenticador;

import java.util.Optional;

@ApplicationScoped
public class AutenticadorRepository implements PanacheRepository<Autenticador> {
  @Inject
  EntityManager em;

  public Optional<Autenticador> findByCveUsuario(String cveUsuario) {
    return find("cveUsuario", cveUsuario).firstResultOptional();
  }

  public Autenticador crearActualizarUsuario(String cveUsuario, String cxNombre, String cxApellido, String cxCorreo, String cxPalabraSecreta) {
    StoredProcedureQuery procedureQuery = em.createStoredProcedureQuery("`mejoreduDB`.`registrar_usuario`", Autenticador.class);
    procedureQuery.registerStoredProcedureParameter("cveUsuario", String.class, ParameterMode.IN);
    procedureQuery.registerStoredProcedureParameter("cxNombre", String.class, ParameterMode.IN);
    procedureQuery.registerStoredProcedureParameter("cxApellido", String.class, ParameterMode.IN);
    procedureQuery.registerStoredProcedureParameter("cxCorreo", String.class, ParameterMode.IN);
    procedureQuery.registerStoredProcedureParameter("cxPalabraSecreta", String.class, ParameterMode.IN);
    procedureQuery.setParameter("cveUsuario", "pruebaUsuario");
    procedureQuery.setParameter("cxNombre", "Prueba");
    procedureQuery.setParameter("cxApellido", "Usuario");
    procedureQuery.setParameter("cxCorreo", "usuario@prueba.com");
    procedureQuery.setParameter("cxPalabraSecreta", "12345678");

    procedureQuery.execute();
    return (Autenticador) procedureQuery.getSingleResult();
  }
}
