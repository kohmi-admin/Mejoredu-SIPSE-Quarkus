package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.Immutable;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.util.Objects;

@Entity(name="vt_autenticador")
@Immutable
public class Autenticador implements Serializable {
  @Id
  @Column(name = "id_contra", nullable = false)
  private Integer id;

  @Column(name = "id_tipo_usuario", nullable = false)
  private Integer idTipoUsuario;

  @Column(name = "cve_usuario", length = 45)
  private String cveUsuario;

  @Column(name = "cx_palabra_secreta", length = 120)
  private String cxPalabraSecreta;

  @Column(name = "cs_estatus", length = 1)
  private String csEstatus;

  @Column(name = "cx_nombre", length = 120)
  private String cxNombre;

  @Column(name = "cx_primer_apellido", length = 120)
  private String cxPrimerApellido;

  @Column(name = "cx_segundo_apellido", length = 120)
  private String cxSegundoApellido;

  @Column(name = "cx_correo", length = 120)
  private String cxCorreo;

  public Integer getIdTipoUsuario() {
    return idTipoUsuario;
  }

  public void setIdTipoUsuario(Integer idTipoUsuario) {
    this.idTipoUsuario = idTipoUsuario;
  }

  public String getCxCorreo() {
    return cxCorreo;
  }

  public void setCxCorreo(String cxCorreo) {
    this.cxCorreo = cxCorreo;
  }

  public String getCxSegundoApellido() {
    return cxSegundoApellido;
  }

  public void setCxSegundoApellido(String cxSegundoApellido) {
    this.cxSegundoApellido = cxSegundoApellido;
  }

  public String getCxPrimerApellido() {
    return cxPrimerApellido;
  }

  public void setCxPrimerApellido(String cxPrimerApellido) {
    this.cxPrimerApellido = cxPrimerApellido;
  }

  public String getCxNombre() {
    return cxNombre;
  }

  public void setCxNombre(String cxNombre) {
    this.cxNombre = cxNombre;
  }

  public String getCsEstatus() {
    return csEstatus;
  }

  public void setCsEstatus(String csEstatus) {
    this.csEstatus = csEstatus;
  }

  public String getCxPalabraSecreta() {
    return cxPalabraSecreta;
  }

  public void setCxPalabraSecreta(String cxPalabraSecreta) {
    this.cxPalabraSecreta = cxPalabraSecreta;
  }

  public String getCveUsuario() {
    return cveUsuario;
  }

  public void setCveUsuario(String cveUsuario) {
    this.cveUsuario = cveUsuario;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Autenticador that = (Autenticador) o;
    return getId() != null && Objects.equals(getId(), that.getId());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
      "id = " + id + ", " +
      "cveUsuario = " + cveUsuario + ", " +
      "cxPalabraSecreta = " + cxPalabraSecreta + ", " +
      "csEstatus = " + csEstatus + ", " +
      "cxNombre = " + cxNombre + ", " +
      "cxPrimerApellido = " + cxPrimerApellido + ", " +
      "cxSegundoApellido = " + cxSegundoApellido + ", " +
      "cxCorreo = " + cxCorreo + ")";
  }
}
