package mx.mejoredu.dgtic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.util.Objects;

@Data
@Embeddable
public class JustificacionDocumentoPK implements Serializable {
  @Column(name = "id_justificacion", nullable = false)
  private Integer idJustificacion;
  @Column(name ="id_archivo", nullable = false)
  private Integer idArchivo;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    JustificacionDocumentoPK that = (JustificacionDocumentoPK) o;
    return getIdJustificacion() != null && Objects.equals(getIdJustificacion(), that.getIdJustificacion())
        && getIdArchivo() != null && Objects.equals(getIdArchivo(), that.getIdArchivo());
  }

  @Override
  public final int hashCode() {
    return Objects.hash(idJustificacion, idArchivo);
  }
}
