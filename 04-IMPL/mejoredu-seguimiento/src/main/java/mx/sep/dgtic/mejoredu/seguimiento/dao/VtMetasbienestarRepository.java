package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.VtMetasBienestarEntity;

@ApplicationScoped
public class VtMetasbienestarRepository implements PanacheRepositoryBase<VtMetasBienestarEntity, Integer> {
}
