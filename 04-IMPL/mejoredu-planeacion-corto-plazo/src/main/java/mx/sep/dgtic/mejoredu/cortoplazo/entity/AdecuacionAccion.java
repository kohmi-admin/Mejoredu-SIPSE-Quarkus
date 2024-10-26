package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_adecuacion_accion")
@Setter @Getter
public class AdecuacionAccion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_adecuacion_accion", nullable = false)
  private Integer idAdecuacionAccion;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @OneToOne
  @JoinColumn(name = "id_presupuesto_modificacion", referencedColumnName = "id_presupuesto", updatable = false, insertable = false)
  private Presupuesto presupuestoModificacion;
  @Column(name = "id_presupuesto_modificacion", nullable = false)
  private Integer idPresupuestoModificacion;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_presupuesto_referencia", referencedColumnName = "id_presupuesto", updatable = false, insertable = false)
  private Presupuesto presupuestoReferencia;
  @Column(name = "id_presupuesto_referencia", nullable = false)
  private Integer idPresupuestoReferencia;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AdecuacionProducto that = (AdecuacionProducto) o;
    return getIdAdecuacionAccion() != null && Objects.equals(getIdAdecuacionAccion(), that.getIdAdecuacionProducto());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idAdecuacionAccion = " + idAdecuacionAccion + ")";
  }
}
