package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "met_partida_gasto")
public class PartidaGasto {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_partida")
  private Integer idPartida;
  @ManyToOne
  @JoinColumn(name = "id_presupuesto")
  private Presupuesto presupuesto;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_partida", updatable = false, insertable = false)
  private MasterCatalogo catalogoPartida;
  @Column(name = "id_catalogo_partida")
  private Integer idCatalogoPartida;
  @OneToMany(mappedBy = "partidaGasto",fetch = FetchType.EAGER, orphanRemoval = true, cascade = CascadeType.ALL)
  private Set<PresupuestoCalendario> calendarios = new HashSet<>();

  @Column(name = "ix_anual")
  private Double ixAnual;

  public Double getIxAnual() {
    return ixAnual;
  }

  public void setIxAnual(Double ixAnual) {
    this.ixAnual = ixAnual;
  }

  public Integer getIdPartida() {
    return idPartida;
  }

  public void setIdPartida(Integer idPartida) {
    this.idPartida = idPartida;
  }

  public Presupuesto getPresupuesto() {
    return presupuesto;
  }

  public void setPresupuesto(Presupuesto presupuesto) {
    this.presupuesto = presupuesto;
  }

  public MasterCatalogo getCatalogoPartida() {
    return catalogoPartida;
  }

  public void setCatalogoPartida(MasterCatalogo catalogoPartida) {
    this.catalogoPartida = catalogoPartida;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    PartidaGasto that = (PartidaGasto) o;
    return getIdPartida() != null && Objects.equals(getIdPartida(), that.getIdPartida());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idPartida = " + idPartida + ")";
  }

  public Set<PresupuestoCalendario> getCalendarios() {
    return calendarios;
  }

  public void setCalendarios(Set<PresupuestoCalendario> calendarios) {
    this.calendarios = calendarios;
  }

  public Integer getIdCatalogoPartida() {
    return idCatalogoPartida;
  }

  public void setIdCatalogoPartida(Integer idCatalogoPartida) {
    this.idCatalogoPartida = idCatalogoPartida;
  }
}
