package mx.mejoredu.dgtic.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entity.EntregablesMirPK;
import mx.mejoredu.dgtic.entity.VtEntregablesMir;

@ApplicationScoped
public class VtEntregablesMirRepository implements PanacheRepositoryBase<VtEntregablesMir, EntregablesMirPK> {
}
