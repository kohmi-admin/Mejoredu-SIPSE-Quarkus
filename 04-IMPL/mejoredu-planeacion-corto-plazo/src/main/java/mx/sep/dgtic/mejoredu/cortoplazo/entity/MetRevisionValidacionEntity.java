package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "met_revision_validacion")
@Setter @Getter
public class MetRevisionValidacionEntity implements Serializable {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  @Column(name = "id_revision", nullable = false)
  private Integer idRevision;
  @Basic
  @Column(name = "id_elemento_validar", nullable = true)
  private Integer idElementoValidar;
  @Basic
  @Column(name = "id_validacion", nullable = true)
  private Integer idValidacion;
  @Basic
  @Column(name = "cx_comentario", nullable = true, length = 500)
  private String cxComentario;
  @Basic
  @Column(name = "ix_check", nullable = true)
  private Integer ixCheck;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    MetRevisionValidacionEntity that = (MetRevisionValidacionEntity) o;
    return idRevision == that.idRevision && idElementoValidar == that.idElementoValidar && idValidacion == that.idValidacion && Objects.equals(cxComentario, that.cxComentario) && Objects.equals(ixCheck, that.ixCheck);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idRevision, idElementoValidar, idValidacion, cxComentario, ixCheck);
  }
}
