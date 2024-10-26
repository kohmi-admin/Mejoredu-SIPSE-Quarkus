package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.*;

@Entity
@Table(name = "seg_usuario")
@Getter @Setter
public class Usuario {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "cve_usuario", unique = true, nullable = false, length = 45)
  private String cveUsuario;
  @Column(name = "cs_estatus", nullable = false, length = 1)
  private String csEstatus;
  @Column(name = "df_baja", nullable = true)
  private Date dfBaja;
  @OneToMany(mappedBy="usuario")
  private Set<PerfilLaboral> perfilLaboral = new HashSet<>();

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Usuario usuario = (Usuario) o;
    return getCveUsuario() != null && Objects.equals(getCveUsuario(), usuario.getCveUsuario());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "cveUsuario = " + cveUsuario + ")";
  }
}
