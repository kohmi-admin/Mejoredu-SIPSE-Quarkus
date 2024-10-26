package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_actividad_fechatentativa")
public class FechaTentativa {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_fecha_tentativa", unique = true, nullable = false)
  private Integer idFechaTentativa;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_actividad", nullable = false)
  private Actividad actividad;

  @Column(name = "cid_catalogo_mes", nullable = false)
  private Integer cidCatalogoMes;

  public Integer getIdFechaTentativa() {
    return idFechaTentativa;
  }

  public void setIdFechaTentativa(Integer idFechaTentativa) {
    this.idFechaTentativa = idFechaTentativa;
  }

  public Actividad getActividad() {
    return actividad;
  }

  public void setActividad(Actividad actividad) {
    this.actividad = actividad;
  }

  public Integer getCidCatalogoMes() {
    return cidCatalogoMes;
  }

  public void setCidCatalogoMes(Integer cidCatalogoMes) {
    this.cidCatalogoMes = cidCatalogoMes;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    FechaTentativa that = (FechaTentativa) o;
    return getIdFechaTentativa() != null && Objects.equals(getIdFechaTentativa(), that.getIdFechaTentativa());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
      "idFechaTentativa = " + idFechaTentativa + ")";
  }
}
