package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.util.Objects;

@Entity(name = "vt_roles")
@Immutable
public class Roles implements Serializable {
  @Id
  @Column(name = "id_facultad", updatable = false, nullable = false)
  private Integer idFacultad;

  @Column(name = "id_tipo_usuario")
  private Integer idTipoUsuario;

  @Column(name = "cd_tipo_usuario")
  private String cdTipoUsuario;

  @Column(name = "ce_facultad")
  private String ceFacultad;

  public Integer getIdFacultad() {
    return idFacultad;
  }

  public void setIdFacultad(Integer idFacultad) {
    this.idFacultad = idFacultad;
  }

  public Integer getIdTipoUsuario() {
    return idTipoUsuario;
  }

  public void setIdTipoUsuario(Integer idTipoUsuario) {
    this.idTipoUsuario = idTipoUsuario;
  }

  public String getCdTipoUsuario() {
    return cdTipoUsuario;
  }

  public void setCdTipoUsuario(String cdTipoUsuario) {
    this.cdTipoUsuario = cdTipoUsuario;
  }

  public String getCeFacultad() {
    return ceFacultad;
  }

  public void setCeFacultad(String ceFacultad) {
    this.ceFacultad = ceFacultad;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Roles roles = (Roles) o;
    return getIdFacultad() != null && Objects.equals(getIdFacultad(), roles.getIdFacultad());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return "Roles{" +
      "id=" + idFacultad +
      ", idTipoUsuario=" + idTipoUsuario +
      ", cdTipoUsuario='" + cdTipoUsuario + '\'' +
      ", ceFacultad='" + ceFacultad + '\'' +
      '}';
  }
}
