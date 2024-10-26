package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.VtIndicadorMirV2;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.VtIndicadorMirV2Projection;

import java.util.List;

@ApplicationScoped
public class VtIndicadorMirV2Repository implements PanacheRepositoryBase<VtIndicadorMirV2, Integer> {
    public List<VtIndicadorMirV2Projection> findByIdAnhioAndIdCatalogoUnidad(int idAnhio, int idCatalogoUnidad) {
        return find("""
        SELECT
            idIndicador,
            idCatalogoIndicador,
            cdOpcion,
            ccExterna,
            ccExternaDos,
            idAnhio,
            idCatalogoUnidad,
            idProdcal,
            mes,
            entregables
        FROM VtIndicadorMirV2
        WHERE
            idAnhio = ?1
            AND idCatalogoUnidad = ?2
        """, idAnhio, idCatalogoUnidad).project(VtIndicadorMirV2Projection.class).list();
    }
    public List<VtIndicadorMirV2Projection> findByIdAnhio(int idAnhio) {
        return find("""
        SELECT
            idIndicador,
            idCatalogoIndicador,
            cdOpcion,
            ccExterna,
            ccExternaDos,
            idAnhio,
            idCatalogoUnidad,
            idProdcal,
            mes,
            entregables
        FROM VtIndicadorMirV2
        WHERE
            idAnhio = ?1
        """, idAnhio).project(VtIndicadorMirV2Projection.class).list();
    }
}
