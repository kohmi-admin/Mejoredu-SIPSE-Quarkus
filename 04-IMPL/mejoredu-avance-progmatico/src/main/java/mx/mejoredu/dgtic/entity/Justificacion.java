package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_justificacion")
@Getter @Setter
public class Justificacion {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_justificacion")
  private Integer idJustificacion;
  @Column(name = "id_indicador_mir")
  private Integer idIndicadorMir;
  @Column(name = "cx_indicador")
  private String cxIndicador;
  @Column(name = "cx_registro_avance")
  private String cxRegistroAvance;
  @Column(name = "cx_causa")
  private String cxCausa;
  @Column(name = "cx_efectos")
  private String cxEfecto;
  @Column(name = "cx_otros_motivos")
  private String cxOtrosMotivos;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Justificacion that = (Justificacion) o;
    return getIdJustificacion() != null && Objects.equals(getIdJustificacion(), that.getIdJustificacion());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idJustificacion = " + idJustificacion + ")";
  }
}
