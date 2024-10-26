package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "seg_usuario")
public class Usuario {
  @Id
  @Column(name = "cve_usuario", unique = true, nullable = false, length = 45)
  private String cveUsuario;
  @Column(name = "cs_estatus", nullable = false, length = 1)
  private String csEstatus;
  @ManyToOne(optional=false)
  @JoinColumn(name="id_tipo_usuario", nullable=false)
  private TipoUsuario tipoUsuario;
  
  @Version
  @Column(name="LOCK_FLAG")
  private Integer lockFlag;
  
  public Integer getLockFlag() {
	return lockFlag;
}

public void setLockFlag(Integer lockFlag) {
	this.lockFlag = lockFlag;
}

public TipoUsuario getTipoUsuario() {
	return tipoUsuario;
}

public void setTipoUsuario(TipoUsuario tipoUsuario) {
	this.tipoUsuario = tipoUsuario;
}

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
