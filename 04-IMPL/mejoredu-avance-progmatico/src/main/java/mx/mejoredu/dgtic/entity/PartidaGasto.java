package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "met_partida_gasto")
@Getter @Setter
public class PartidaGasto {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_partida", nullable = false)
  private Integer idPartida;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_presupuesto", referencedColumnName = "id_presupuesto", nullable = false, updatable = false, insertable = false)
  private Presupuesto presupuesto;
  @Column(name = "id_presupuesto", nullable = false)
  private Integer idPresupuesto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_partida", referencedColumnName = "id_catalogo", nullable = false, updatable = false, insertable = false)
  private MasterCatalogo catalogoPartida;
  @Column(name = "id_catalogo_partida", nullable = false)
  private Integer idCatalogoPartida;
  @Column(name = "ix_anual")
  private Double ixAnual;
  @OneToMany(mappedBy = "partida")
  private Set<PresupuestoCalendario> presupuestoCalendarios = new HashSet<>();

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    PartidaGasto that = (PartidaGasto) o;
    return getIdPartida() != null && getIdPartida().equals(that.getIdPartida());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idPartida = " + idPartida + ")";
  }

}
