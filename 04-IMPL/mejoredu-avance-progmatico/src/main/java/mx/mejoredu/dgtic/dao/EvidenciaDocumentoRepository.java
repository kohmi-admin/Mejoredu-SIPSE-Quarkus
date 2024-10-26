package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.EvidenciaDocumento;

@ApplicationScoped
public class EvidenciaDocumentoRepository implements PanacheRepositoryBase<EvidenciaDocumento, Integer> {

}
