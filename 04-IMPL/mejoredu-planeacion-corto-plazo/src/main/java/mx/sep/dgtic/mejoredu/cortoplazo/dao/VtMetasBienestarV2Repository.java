package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.VtMetasBienestarV2Entity;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.VtMetasBienestarV2Projection;

import java.util.List;

@ApplicationScoped
public class VtMetasBienestarV2Repository implements PanacheRepositoryBase<VtMetasBienestarV2Entity, Integer> {
  public List<VtMetasBienestarV2Projection> findByAnhioAndIdUnidad(Integer anhio, Integer idUnidad) {
    return find("""
      SELECT
        idElemento,
        idIndicadorPi,
        cveObjetivo,
        periodicidad,
        periodicidadOtro,
        unidadMedida,
        unidadMedidaOtro,
        tendencia,
        indicador,
        SUM(entregables)
      FROM VtMetasBienestarV2Entity
      WHERE idAnhio = ?1 AND idUnidad = ?2
      GROUP BY
        idElemento,
        idIndicadorPi,
        cveObjetivo,
        periodicidad,
        periodicidadOtro,
        unidadMedida,
        unidadMedidaOtro,
        tendencia,
        indicador
    """, anhio, idUnidad).project(VtMetasBienestarV2Projection.class).list();
  }
  public List<VtMetasBienestarV2Projection> findByAnhio(Integer anhio) {
    return find("""
      SELECT
        idElemento,
        idIndicadorPi,
        cveObjetivo,
        periodicidad,
        periodicidadOtro,
        unidadMedida,
        unidadMedidaOtro,
        tendencia,
        indicador,
        SUM(entregables)
      FROM VtMetasBienestarV2Entity
      WHERE idAnhio = ?1
      GROUP BY
        idElemento,
        idIndicadorPi,
        cveObjetivo,
        periodicidad,
        periodicidadOtro,
        unidadMedida,
        unidadMedidaOtro,
        tendencia,
        indicador
    """, anhio).project(VtMetasBienestarV2Projection.class).list();
  }
}
