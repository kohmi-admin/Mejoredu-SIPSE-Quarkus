package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_tipo_documento")
@Getter @Setter
public class TipoDocumento {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_tipo_documento", unique = true, nullable = false)
  private Integer idTipoDocumento;
  @Column(name = "cd_tipo_documento", nullable = false, length = 45)
  private String cdTipoDocumento;
  @Column(name = "cx_extension", nullable = false, length = 45)
  private String cxExtension;
  @Column(name = "cx_tipo_contenido", nullable = false, length = 45)
  private String cxTipoContenido;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    TipoDocumento that = (TipoDocumento) o;
    return getIdTipoDocumento() != null && Objects.equals(getIdTipoDocumento(), that.getIdTipoDocumento());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idTipoDocumento = " + idTipoDocumento + ")";
  }
}
