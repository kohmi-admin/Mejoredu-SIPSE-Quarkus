package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@Table(name = "met_presupuesto_calendario")
public class PresupuestoCalendario {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_calendario")
  private Integer idCalendario;
  @Column(name = "ix_mes")
  private Integer ixMes;
  @Column(name = "ix_monto")
  private Double ixMonto;
  @ManyToOne
  @JoinColumn(name = "id_partida")
  private PartidaGasto partidaGasto;

  public Integer getIdCalendario() {
    return idCalendario;
  }

  public void setIdCalendario(Integer idCalendario) {
    this.idCalendario = idCalendario;
  }

  public Integer getIxMes() {
    return ixMes;
  }

  public void setIxMes(Integer ixMes) {
    this.ixMes = ixMes;
  }

  public Double getIxMonto() {
    return ixMonto;
  }

  public void setIxMonto(Double ixMonto) {
    this.ixMonto = ixMonto;
  }

  public PartidaGasto getPartidaGasto() {
    return partidaGasto;
  }

  public void setPartidaGasto(PartidaGasto partidaGasto) {
    this.partidaGasto = partidaGasto;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    PresupuestoCalendario that = (PresupuestoCalendario) o;
    return getIdCalendario() != null && Objects.equals(getIdCalendario(), that.getIdCalendario());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idCalendario = " + idCalendario + ")";
  }
}
