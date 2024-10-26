package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.JustificacionDocumento;
import mx.mejoredu.dgtic.entity.JustificacionDocumentoPK;

@ApplicationScoped
public class JustificacionDocumentoRepository implements PanacheRepositoryBase<JustificacionDocumento, JustificacionDocumentoPK> {
}
