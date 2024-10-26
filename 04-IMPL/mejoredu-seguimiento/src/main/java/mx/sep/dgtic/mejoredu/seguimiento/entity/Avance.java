package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_avance")
@Getter @Setter
public class Avance {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  @Column(name = "id_avance", nullable = false)
  private Integer idAvance;
  @Column(name = "ix_tipo_registro", nullable = false)
  private Integer ixTipoRegistro;
  @ManyToOne
  @JoinColumn(name = "id_prodcal", referencedColumnName = "id_prodcal")
  private ProductoCalendario productoCalendario;
  @ManyToOne
  @JoinColumn(name = "id_prodcal_entregado", referencedColumnName = "id_prodcal")
  private ProductoCalendario productoCalendarioEntregado;
  @ManyToOne
  @JoinColumn(name = "id_actividad", referencedColumnName = "id_actividad")
  private Actividad actividad;
  @Column(name = "ix_cicloValidacion")
  private Integer ixCicloValidacion;
  @Column(name = "id_validacion")
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion")
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor")
  private Integer idValidacionSupervisor;
  @Column(name = "cx_mes")
  private Integer cxMes;
  @Column(name = "cve_usuario")
  private String cveUsuario;
  @ManyToOne
  @JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", insertable = false, updatable = false)
  private Usuario usuario;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Avance avance = (Avance) o;
    return getIdAvance() != null && Objects.equals(getIdAvance(), avance.getIdAvance());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idAvance = " + idAvance + ")";
  }
}
