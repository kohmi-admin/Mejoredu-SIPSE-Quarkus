package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.TipoDocumento;

@ApplicationScoped
public class TipoDocumentoRepository implements PanacheRepositoryBase<TipoDocumento, Integer> {
    public TipoDocumento findByExtension(String extencion) {
        return find("cxExtension", extencion).firstResult();
    }
}

