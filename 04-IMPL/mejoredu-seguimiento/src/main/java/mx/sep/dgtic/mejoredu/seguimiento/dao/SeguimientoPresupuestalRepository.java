package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SeguimientoPresupuestal;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SeguimientoPresupuestalPK;

@ApplicationScoped
public class SeguimientoPresupuestalRepository implements PanacheRepositoryBase<SeguimientoPresupuestal, SeguimientoPresupuestalPK> {
}