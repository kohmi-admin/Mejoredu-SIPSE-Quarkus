package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@Table(name = "met_indicador_programa")
public class IndicadorPrograma {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_indicador_programa", nullable = false)
  private Integer idIndicadorPrograma;
  @OneToOne
  @JoinColumn(name = "id_ficha_indicadores", updatable = false, insertable = false)
  private FichaIndicadores fichaIndicadores;
  @Column(name = "id_ficha_indicadores")
  private Integer idFichaIndicadores;
  @OneToOne
  @JoinColumn(name = "id_presupuestal", updatable = false, insertable = false)
  private ProgramaPresupuestal presupuestal;
  @Column(name = "id_presupuestal")
  private Integer idPresupuestal;
  @Column(name = "cx_nombre_programa")
  private String cxNombrePrograma;
  @Column(name = "id_vinculacion_ods")
  private Integer idVinculacionOds;
  @Column(name = "id_ramo_sector")
  private Integer idRamoSector;
  @Column(name = "id_unidad_responsable")
  private Integer idUnidadResponsable;

  public Integer getIdIndicadorPrograma() {
    return idIndicadorPrograma;
  }

  public void setIdIndicadorPrograma(Integer idIndicadorPrograma) {
    this.idIndicadorPrograma = idIndicadorPrograma;
  }

  public FichaIndicadores getFichaIndicadores() {
    return fichaIndicadores;
  }

  public void setFichaIndicadores(FichaIndicadores fichaIndicadores) {
    this.fichaIndicadores = fichaIndicadores;
  }

  public Integer getIdFichaIndicadores() {
    return idFichaIndicadores;
  }

  public void setIdFichaIndicadores(Integer idFichaIndicadores) {
    this.idFichaIndicadores = idFichaIndicadores;
  }

  public ProgramaPresupuestal getPresupuestal() {
    return presupuestal;
  }

  public void setPresupuestal(ProgramaPresupuestal presupuestal) {
    this.presupuestal = presupuestal;
  }

  public Integer getIdPresupuestal() {
    return idPresupuestal;
  }

  public void setIdPresupuestal(Integer idPresupuestal) {
    this.idPresupuestal = idPresupuestal;
  }

  public String getCxNombrePrograma() {
    return cxNombrePrograma;
  }

  public void setCxNombrePrograma(String cxNombrePrograma) {
    this.cxNombrePrograma = cxNombrePrograma;
  }

  public Integer getIdVinculacionOds() {
    return idVinculacionOds;
  }

  public void setIdVinculacionOds(Integer idVinculacionOds) {
    this.idVinculacionOds = idVinculacionOds;
  }

  public Integer getIdRamoSector() {
    return idRamoSector;
  }

  public void setIdRamoSector(Integer idRamoSector) {
    this.idRamoSector = idRamoSector;
  }

  public Integer getIdUnidadResponsable() {
    return idUnidadResponsable;
  }

  public void setIdUnidadResponsable(Integer idUnidadResponsable) {
    this.idUnidadResponsable = idUnidadResponsable;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    IndicadorPrograma that = (IndicadorPrograma) o;
    return getIdIndicadorPrograma() != null && Objects.equals(getIdIndicadorPrograma(), that.getIdIndicadorPrograma());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idIndicadorPrograma = " + idIndicadorPrograma + ")";
  }
}
