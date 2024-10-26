package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_adecuacion_proyecto")
@Getter @Setter
public class AdecuacionProyecto {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  @Column(name = "id_adecuacion_proyecto", nullable = false)
  private Integer idAdecuacionProyecto;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @OneToOne
  @JoinColumn(name = "id_proyecto_modificacion", referencedColumnName = "id_proyecto", updatable = false, insertable = false)
  private ProyectoAnual proyectoModificacion;
  @Column(name = "id_proyecto_modificacion", nullable = false)
  private Integer idProyectoModificacion;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_proyecto_referencia", referencedColumnName = "id_proyecto", updatable = false, insertable = false)
  private ProyectoAnual proyectoReferencia;
  @Column(name = "id_proyecto_referencia", nullable = false)
  private Integer idProyectoReferencia;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AdecuacionProyecto that = (AdecuacionProyecto) o;
    return getIdAdecuacionProyecto() != null && Objects.equals(getIdAdecuacionProyecto(), that.getIdAdecuacionProyecto());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idAdecuacionProyecto = " + idAdecuacionProyecto + ")";
  }
}
