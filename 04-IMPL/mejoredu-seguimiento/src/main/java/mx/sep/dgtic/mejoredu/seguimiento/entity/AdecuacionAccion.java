package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_adecuacion_accion")
@Setter @Getter
public class AdecuacionAccion {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_adecuacion_accion", nullable = false)
  private Integer idAdecuacionAccion;
  @ManyToOne
  @JoinColumn(name = "id_adecuacion_solicitud", referencedColumnName = "id_adecuacion_solicitud", updatable = false, insertable = false)
  private AdecuacionSolicitud adecuacionSolicitud;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @OneToOne
  @JoinColumn(name = "id_presupuesto_modificacion", referencedColumnName = "id_presupuesto", updatable = false, insertable = false)
  private Presupuesto accionModificacion;
  @Column(name = "id_presupuesto_modificacion")
  private Integer idAccionModificacion;
  @ManyToOne
  @JoinColumn(name = "id_presupuesto_referencia", referencedColumnName = "id_presupuesto", updatable = false, insertable = false)
  private Presupuesto accionReferencia;
  @Column(name = "id_presupuesto_referencia")
  private Integer idAccionReferencia;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AdecuacionAccion that = (AdecuacionAccion) o;
    return getIdAdecuacionAccion() != null && Objects.equals(getIdAdecuacionAccion(), that.getIdAdecuacionAccion());
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
