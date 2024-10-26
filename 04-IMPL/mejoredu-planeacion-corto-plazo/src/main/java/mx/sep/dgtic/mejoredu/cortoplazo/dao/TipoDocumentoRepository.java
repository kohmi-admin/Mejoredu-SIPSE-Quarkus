package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.TipoDocumento;

@ApplicationScoped
public class TipoDocumentoRepository implements PanacheRepositoryBase<TipoDocumento, Integer> {
    public TipoDocumento findByExtension(String extencion) {
        return find("cxExtension", extencion).firstResult();
    }
}

