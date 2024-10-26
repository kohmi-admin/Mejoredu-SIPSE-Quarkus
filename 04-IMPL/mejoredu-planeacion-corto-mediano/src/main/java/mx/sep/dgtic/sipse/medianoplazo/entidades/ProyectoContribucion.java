package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_proyecto_contribucion")
@Getter @Setter
public class ProyectoContribucion {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_proycontri", unique = true, nullable = false)
  private Integer idProyectoContribucion;
  @Column(name = "ix_tipo_contri")
  private Integer ixTipoContribucion;
  @Column(name = "id_proyecto", nullable = false)
  private Integer idProyecto;
  @Column(name = "id_catalogo_contribucion", nullable = false)
  private Integer idCatalogoContribucion;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_contribucion", insertable = false, updatable = false)
  private MasterCatalogo masterCatalogo;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    ProyectoContribucion that = (ProyectoContribucion) o;
    return getIdProyectoContribucion() != null && Objects.equals(getIdProyectoContribucion(), that.getIdProyectoContribucion());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idProyectoContribucion = " + idProyectoContribucion + ")";
  }
}
