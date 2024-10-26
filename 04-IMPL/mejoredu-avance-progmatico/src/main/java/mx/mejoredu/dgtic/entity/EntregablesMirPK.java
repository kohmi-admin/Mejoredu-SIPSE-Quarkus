package mx.mejoredu.dgtic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.util.Objects;

@Data
@Embeddable
public class EntregablesMirPK implements Serializable {
  @Column(name = "id_indicador_resultado", nullable = false)
  private Integer idIndicadorResultado;
  @Column(name = "id_catalogo", nullable = false)
  private Integer idCatalogo;
  @Column(name = "ci_mes", nullable = false)
  private Integer ciMes;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    EntregablesMirPK that = (EntregablesMirPK) o;
    return getIdIndicadorResultado() != null && Objects.equals(getIdIndicadorResultado(), that.getIdIndicadorResultado())
        && getIdCatalogo() != null && Objects.equals(getIdCatalogo(), that.getIdCatalogo());
  }

  @Override
  public final int hashCode() {
    return Objects.hash(idIndicadorResultado, idCatalogo);
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idIndicadorResultado = " + idIndicadorResultado + ", " +
        "idCatalogo = " + idCatalogo + ")";
  }
}
