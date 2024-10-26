package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Archivo;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.FormularioAnalitico;

import java.util.Set;

@ApplicationScoped
public class FormularioAnaliticoRepository implements PanacheRepository<FormularioAnalitico> {
  public Set<Archivo> listarArchivos(Long idFormulario) {
    return find("idFormulario", idFormulario).firstResult().getArchivos();
  }
}
