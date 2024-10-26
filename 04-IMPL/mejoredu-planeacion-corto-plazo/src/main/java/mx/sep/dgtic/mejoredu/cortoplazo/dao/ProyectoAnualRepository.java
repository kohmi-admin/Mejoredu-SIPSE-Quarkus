package mx.sep.dgtic.mejoredu.cortoplazo.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.ProyectoAnual;

import java.util.List;


@ApplicationScoped
public class ProyectoAnualRepository implements PanacheRepositoryBase<ProyectoAnual, Integer> {
  private final List<String> VALID_ESTATUS = List.of("C", "I", "T");

  public ProyectoAnual findByNombre(String nombre) {
    return find("cxNombreProyecto = ?1 and csEstatus != 'B'", nombre).firstResult();
  }

  // This Query should get all the ProyectoAnual that doesn't have a relationship with adecuacionProyecto
  // Performing a left join with adecuacionProyecto and filtering the ones that doesn't have a relationship
  public List<ProyectoAnual> findAllByYearOnlyFromCortoPlazo(int idAnhio) {
    return list("""
        SELECT p
        FROM ProyectoAnual p
        LEFT JOIN p.adecuacionProyecto a
        WHERE
            a.proyectoModificacion IS NULL
            AND p.anhoPlaneacion.idAnhio = ?1
            AND p.csEstatus IN ?2
        """, idAnhio, VALID_ESTATUS);
  }

  public List<ProyectoAnual> findAllByYearAndEstatusOnlyFromCortoPlazo(int idAnhio, String estatus) {
    return list("""
        SELECT p
        FROM ProyectoAnual p
        LEFT JOIN p.adecuacionProyecto a
        WHERE
          a.proyectoModificacion IS NULL
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.csEstatus = ?2
        """, idAnhio, estatus);
  }

  public List<ProyectoAnual> findAllByYearAndEstatusOnlyFromCortoPlazo(int idAnhio, List<String> estatus) {
    return list("""
        SELECT p
        FROM ProyectoAnual p
        LEFT JOIN p.adecuacionProyecto a
        WHERE
          a.proyectoModificacion IS NULL
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.csEstatus IN ?2
        """, idAnhio, estatus);
  }

  public List<ProyectoAnual> findAllByYearOriginAndEstatusOnlyFromCortoPlazo(int idAnhio, int ixFuenteRegistro, List<String> estatus) {
    return list("""
        SELECT p
        FROM ProyectoAnual p
        LEFT JOIN p.adecuacionProyecto a
        WHERE
          a.proyectoModificacion IS NULL
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.ix_fuente_registro = ?2
          AND p.csEstatus IN ?3
        """, idAnhio, ixFuenteRegistro, estatus);
  }

  public List<ProyectoAnual> findAllByYearSemanticaAndEstatusOnlyFromCortoPlazo(int idAnhio, int itSemantica, List<String> estatus) {
    return list("""
        SELECT p
        FROM ProyectoAnual p
        LEFT JOIN p.adecuacionProyecto a
        WHERE
          a.proyectoModificacion IS NULL
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.itSemantica = ?2
          AND p.csEstatus in ?3
        """, idAnhio, itSemantica, estatus);
  }

  public List<ProyectoAnual> findAllByYearSemanticaUnidadAndEstatusOnlyFromCortoPlazo(int idAnhio, int itSemantica, int idUnidad, List<String> csEstatus) {
    return list("""
        SELECT p
        FROM ProyectoAnual p
        LEFT JOIN p.adecuacionProyecto a
        WHERE
          a.proyectoModificacion IS NULL
          AND p.anhoPlaneacion.idAnhio = ?1
          AND p.itSemantica = ?2
          AND p.unidadAdministrativa.idCatalogo = ?3
          AND p.csEstatus IN ?4
        """, idAnhio, itSemantica, idUnidad, csEstatus);
  }
}
