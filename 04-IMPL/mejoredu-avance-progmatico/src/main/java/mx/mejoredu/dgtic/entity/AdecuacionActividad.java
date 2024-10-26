package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

@Entity
@Table(name = "met_adecuacion_actividad")
@Getter @Setter
public class AdecuacionActividad {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_adecuacion_actividad", nullable = false)
  private Integer idAdecuacionActividad;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_adecuacion_solicitud", referencedColumnName = "id_adecuacion_solicitud", updatable = false, insertable = false)
  private AdecuacionSolicitud adecuacionSolicitud;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_actividad_modificacion", referencedColumnName = "id_actividad", updatable = false, insertable = false)
  private CortoplazoActividad actividadModificacion;
  @Column(name = "id_actividad_modificacion")
  private Integer idActividadModificacion;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_actividad_referencia", referencedColumnName = "id_actividad", updatable = false, insertable = false)
  private CortoplazoActividad actividadReferencia;
  @Column(name = "id_actividad_referencia")
  private Integer idActividadReferencia;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AdecuacionActividad that = (AdecuacionActividad) o;
    return getIdAdecuacionActividad() != null && getIdAdecuacionActividad().equals(that.getIdAdecuacionActividad());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
      "idAdecuacionActividad = " + idAdecuacionActividad + ")";
  }
}
