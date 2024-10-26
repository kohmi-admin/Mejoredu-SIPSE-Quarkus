package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Date;
import java.sql.Time;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "met_cortoplazo_presupuesto")
@Setter @Getter
public class Presupuesto {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_presupuesto", nullable = false)
  private Integer idPresupuesto;
  @Column(name = "cve_accion")
  private Integer cveAccion;
  @Column(name = "cx_nombre_accion")
  private String cxNombreAccion;
  @Column(name = "cve_nivel_educativo")
  private String cveNivelEducativo;
  @Column(name = "cx_presupuesto_anual")
  private String cxPresupuestoAnual;
  @Column(name = "cb_productos_asociados")
  private String cbProductosAsociados;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", updatable = false, insertable = false)
  private Usuario usuario;
  @Column(name = "cve_usuario", nullable = false)
  private String cveUsuario;
  @Column(name = "df_presupuesto")
  private Date dfPresupuesto;
  @Column(name = "dh_presupuesto")
  private Time dhPresupuesto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_producto", referencedColumnName = "id_producto", updatable = false, insertable = false)
  private Producto producto;
  @Column(name = "id_producto", nullable = false)
  private Integer idProducto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_centro_costo", referencedColumnName = "id_catalogo", updatable = false, insertable = false)
  private MasterCatalogo catalogoCentroCosto;
  @Column(name = "id_catalogo_centro_costo", nullable = false)
  private Integer idCatalogoCentroCosto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_fuente", referencedColumnName = "id_catalogo", updatable = false, insertable = false)
  private MasterCatalogo catalogoFuente;
  @Column(name = "id_catalogo_fuente", nullable = false)
  private Integer idCatalogoFuente;
  @Column(name = "cs_estatus")
  private String csEstatus;
  @OneToMany(mappedBy = "presupuesto")
  private Set<PartidaGasto> partidaGastos = new HashSet<>();

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Presupuesto that = (Presupuesto) o;
    return getIdPresupuesto() != null && getIdPresupuesto().equals(that.getIdPresupuesto());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idPresupuesto = " + idPresupuesto + ")";
  }
}
