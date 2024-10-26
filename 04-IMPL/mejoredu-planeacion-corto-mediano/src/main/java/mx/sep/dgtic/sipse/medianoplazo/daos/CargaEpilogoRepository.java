package mx.sep.dgtic.sipse.medianoplazo.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.sipse.medianoplazo.entidades.CargaEpilogo;

import java.util.List;

@ApplicationScoped
public class CargaEpilogoRepository implements PanacheRepositoryBase<CargaEpilogo, Integer> {
  public List<CargaEpilogo> findByEpilogo(Integer idEpilogo) {
    return find("epilogo.idEpilogo", idEpilogo).list();
  }

  public List<CargaEpilogo> findByEpilogoAndTipoDocumento(Integer idEpilogo, Integer ixTipoDocumento) {
    return find("epilogo.idEpilogo = ?1 and ixTipoDocumento = ?2", idEpilogo, ixTipoDocumento).list();
  }
}
