package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

@Entity
@Table(name = "met_presupuesto_calendario")
@Getter @Setter
public class PresupuestoCalendario {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_calendario", nullable = false)
  private Integer idCalendario;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_partida", referencedColumnName = "id_partida", nullable = false, updatable = false, insertable = false)
  private PartidaGasto partida;
  @Column(name = "id_partida", nullable = false)
  private Integer idPartida;
  @Column(name = "ix_mes")
  private Integer ixMes;
  @Column(name = "ix_monto")
  private Double ixMonto;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    PresupuestoCalendario that = (PresupuestoCalendario) o;
    return getIdCalendario() != null && getIdCalendario().equals(that.getIdCalendario());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idCalendario = " + idCalendario + ")";
  }
}
