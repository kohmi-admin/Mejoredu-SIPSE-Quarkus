package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_archivo_seccion")
@Getter
@Setter
public class ArchivoSeccion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_archivo_seccion")
  private Integer idArchivoSeccion;
  @Column(name = "id_archivo")
  private Integer idArchivo;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_archivo", insertable = false, updatable = false)
  private Archivo archivo;
  @Column(name = "id_anhio")
  private Integer idAnhio;
  @Column(name = "ix_seccion")
  private Integer ixSeccion;
  @Column(name = "ix_subseccion")
  private Integer ixSubseccion;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    ArchivoSeccion that = (ArchivoSeccion) o;
    return getIdArchivoSeccion() != null && Objects.equals(getIdArchivoSeccion(), that.getIdArchivoSeccion());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idArchivoSeccion = " + idArchivoSeccion + ")";
  }
}
