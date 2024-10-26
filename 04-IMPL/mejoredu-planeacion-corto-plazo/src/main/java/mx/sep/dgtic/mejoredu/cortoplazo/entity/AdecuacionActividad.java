package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_adecuacion_actividad")
@Setter @Getter
public class AdecuacionActividad {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_adecuacion_actividad", nullable = false)
  private Integer idAdecuacionActividad;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @OneToOne
  @JoinColumn(name = "id_actividad_modificacion", referencedColumnName = "id_actividad", updatable = false, insertable = false)
  private Actividad actividadModificacion;
  @Column(name = "id_actividad_modificacion", nullable = false)
  private Integer idActividadModificacion;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_actividad_referencia", referencedColumnName = "id_actividad", updatable = false, insertable = false)
  private Actividad actividadReferencia;
  @Column(name = "id_actividad_referencia", nullable = false)
  private Integer idActividadReferencia;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AdecuacionActividad that = (AdecuacionActividad) o;
    return getIdAdecuacionActividad() != null && Objects.equals(getIdAdecuacionActividad(), that.getIdAdecuacionActividad());
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

