package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Archivo;
import mx.sep.dgtic.mejoredu.seguimiento.entity.FormularioAnalitico;

import java.util.Set;

@ApplicationScoped
public class FormularioAnaliticoRepository implements PanacheRepository<FormularioAnalitico> {
  public Set<Archivo> listarArchivos(Long idFormulario) {
    return find("idFormulario", idFormulario).firstResult().getArchivos();
  }
}
