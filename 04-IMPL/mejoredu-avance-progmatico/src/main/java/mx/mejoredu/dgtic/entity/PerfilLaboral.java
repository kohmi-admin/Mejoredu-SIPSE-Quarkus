package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "seg_perfil_laboral")
@Getter @Setter
public class PerfilLaboral {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_perfil_laboral")
  private Integer idPerfilLaboral;
  @Column(name = "cve_usuario")
  private String cveUsuario;
  @Column(name = "id_catalogo_unidad")
  private Integer idCatalogoUnidad;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    PerfilLaboral that = (PerfilLaboral) o;
    return getIdPerfilLaboral() != null && Objects.equals(getIdPerfilLaboral(), that.getIdPerfilLaboral());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idPerfilLaboral = " + idPerfilLaboral + ")";
  }
}
