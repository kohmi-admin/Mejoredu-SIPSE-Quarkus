package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.TipoDocumento;

@ApplicationScoped
public class TipoDocumentoRepository implements PanacheRepositoryBase<TipoDocumento, Integer> {
    public TipoDocumento findByExtension(String extencion) {
        return find("cxExtension", extencion).firstResult();
    }
}

