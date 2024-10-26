package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;

import java.util.List;
import java.util.Objects;

@Entity(name = "seg_usuario")
public class Usuario {
  @Id
  @Column(name = "cve_usuario", unique = true, nullable = false, length = 45)
  private String cveUsuario;
  @Column(name = "cs_estatus", nullable = false, length = 1)
  private String csEstatus;
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "id_tipo_usuario", nullable = false)
  private TipoUsuario tipoUsuario;

  public String getCveUsuario() {
    return cveUsuario;
  }

  public void setCveUsuario(String cveUsuario) {
    this.cveUsuario = cveUsuario;
  }

  public String getCsEstatus() {
    return csEstatus;
  }

  public void setCsEstatus(String csEstatus) {
    this.csEstatus = csEstatus;
  }

  public TipoUsuario getTipoUsuario() {
    return tipoUsuario;
  }

  public void setTipoUsuario(TipoUsuario tipoUsuario) {
    this.tipoUsuario = tipoUsuario;
  }

  public boolean hasReadPermission() {
    var enabledRoles = List.of(TipoUsuarioEnum.CONSULTOR.getCdTipoUsuario(), TipoUsuarioEnum.ADMINISTRADOR.getCdTipoUsuario(), TipoUsuarioEnum.SUPERVISOR.getCdTipoUsuario());

    return this.tipoUsuario.getCdTipoUsuario() != null && enabledRoles.contains(this.tipoUsuario.getCdTipoUsuario());
  }

  public boolean hasValidationPermission() {
    var enabledRoles = List.of(TipoUsuarioEnum.SUPERVISOR.getIdTipoUsuario());

    return enabledRoles.contains(this.tipoUsuario.getIdTipoUsuario());
  }

  @Override
  public String toString() {
    return "Usuario{" +
        "cveUsuario='" + cveUsuario + '\'' +
        ", csEstatus='" + csEstatus + '\'' +
        '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Usuario usuario = (Usuario) o;

    if (!Objects.equals(cveUsuario, usuario.cveUsuario)) return false;
    return Objects.equals(csEstatus, usuario.csEstatus);
  }

  @Override
  public int hashCode() {
    int result = cveUsuario != null ? cveUsuario.hashCode() : 0;
    result = 31 * result + (csEstatus != null ? csEstatus.hashCode() : 0);
    return result;
  }
}
