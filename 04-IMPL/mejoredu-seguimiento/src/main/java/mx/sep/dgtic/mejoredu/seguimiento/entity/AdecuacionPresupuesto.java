package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_adecuacion_presupuesto")
@Setter @Getter
public class AdecuacionPresupuesto {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_adecuacion_presupuesto", nullable = false)
  private Integer idAdecuacionPresupuesto;
  @ManyToOne
  @JoinColumn(name = "id_adecuacion_solicitud", referencedColumnName = "id_adecuacion_solicitud", updatable = false, insertable = false)
  private AdecuacionSolicitud adecuacionSolicitud;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @OneToOne
  @JoinColumn(name = "id_presupuesto_modificacion", referencedColumnName = "id_presupuesto", updatable = false, insertable = false)
  private Presupuesto presupuestoModificacion;
  @Column(name = "id_presupuesto_modificacion")
  private Integer idPresupuestoModificacion;
  @ManyToOne
  @JoinColumn(name = "id_presupuesto_referencia", referencedColumnName = "id_presupuesto", updatable = false, insertable = false)
  private Presupuesto presupuestoReferencia;
  @Column(name = "id_presupuesto_referencia")
  private Integer idPresupuestoReferencia;
  @ManyToOne
  @JoinColumn(name = "id_presupuesto_referencia_b", referencedColumnName = "id_presupuesto", updatable = false, insertable = false)
  private Presupuesto presupuestoReferenciaB;
  @Column(name = "id_presupuesto_referencia_b")
  private Integer idPresupuestoReferenciaB;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AdecuacionPresupuesto that = (AdecuacionPresupuesto) o;
    return getIdAdecuacionPresupuesto() != null && Objects.equals(getIdAdecuacionPresupuesto(), that.getIdAdecuacionPresupuesto());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idAdecuacionPresupuesto = " + idAdecuacionPresupuesto + ")";
  }
}
