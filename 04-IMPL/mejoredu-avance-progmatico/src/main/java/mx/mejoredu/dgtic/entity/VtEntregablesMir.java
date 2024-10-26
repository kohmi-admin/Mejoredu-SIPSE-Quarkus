package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "vt_entregables_mir")
@Immutable
@Getter @Setter
public class VtEntregablesMir {
  @EmbeddedId
  private EntregablesMirPK id;
  @Column(name = "id_anhio")
  private Integer idAnhio;
  @Column(name = "cx_nivel")
  private String cxNivel;
  @Column(name = "cx_nombre")
  private String cxNombre;
  @Column(name = "cd_opcion")
  private String cdOpcion;

  @Column(name = "ci_programado")
  private Integer ciProgramado;
  @Column(name = "ci_entregado")
  private Integer ciEntregado;
  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    VtEntregablesMir that = (VtEntregablesMir) o;
    return getId() != null && Objects.equals(getId(), that.getId());
  }

  @Override
  public final int hashCode() {
    return Objects.hash(id);
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "EmbeddedId = " + id + ")";
  }
}
