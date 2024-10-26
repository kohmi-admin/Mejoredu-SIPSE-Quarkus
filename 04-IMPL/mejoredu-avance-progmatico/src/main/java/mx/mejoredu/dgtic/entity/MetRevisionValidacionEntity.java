package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Table(name = "met_revision_validacion")
@Getter @Setter
public class MetRevisionValidacionEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_revision", nullable = false)
  private Integer idRevision;
  @Column(name = "id_elemento_validar", nullable = true)
  private Integer idElementoValidar;
  @Column(name = "id_validacion", nullable = true)
  private Integer idValidacion;
  @Column(name = "cx_comentario", nullable = true, length = 500)
  private String cxComentario;
  @Column(name = "ix_check", nullable = true)
  private Integer ixCheck;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    MetRevisionValidacionEntity that = (MetRevisionValidacionEntity) o;
    return Objects.equals(idRevision, that.idRevision) && Objects.equals(idElementoValidar, that.idElementoValidar) && Objects.equals(idValidacion, that.idValidacion) && Objects.equals(cxComentario, that.cxComentario) && Objects.equals(ixCheck, that.ixCheck);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idRevision, idElementoValidar, idValidacion, cxComentario, ixCheck);
  }
}
