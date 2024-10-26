package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_estrategia_accion")
@Getter @Setter
public class EstrategiaAccion {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_estaci", unique = true, nullable = false)
  private Integer idEstrategiaAccion;
  @Column(name = "ix_tipo")
  private Integer ixTipo;
  @Column(name = "id_actividad", nullable = false)
  private Integer idActividad;
  @Column(name = "id_catalogo", nullable = false)
  private Integer idCatalogo;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    EstrategiaAccion that = (EstrategiaAccion) o;
    return getIdEstrategiaAccion() != null && Objects.equals(getIdEstrategiaAccion(), that.getIdEstrategiaAccion());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idEstrategiaAccion = " + idEstrategiaAccion + ")";
  }
}
