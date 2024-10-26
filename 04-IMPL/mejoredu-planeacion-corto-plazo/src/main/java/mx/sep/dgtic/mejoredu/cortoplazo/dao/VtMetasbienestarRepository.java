package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.VtMetasBienestarEntity;

import java.util.List;

@ApplicationScoped
public class VtMetasbienestarRepository implements PanacheRepositoryBase<VtMetasBienestarEntity, Integer> {
}
