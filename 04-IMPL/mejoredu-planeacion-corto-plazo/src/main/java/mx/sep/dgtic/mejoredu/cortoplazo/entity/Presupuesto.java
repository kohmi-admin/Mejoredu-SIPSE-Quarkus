package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "met_cortoplazo_presupuesto")
@Getter @Setter
public class Presupuesto extends ValidableBase {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_presupuesto")
  private Integer idPresupuesto;

  @Column(name = "cve_accion")
  private Integer cveAccion;
  @Column(name = "cx_nombre_accion")
  private String cxNombreAccion;
  @Column(name = "cve_nivel_educativo")
  private String cveNivelEducativo;
  @Column(name = "cx_presupuesto_anual")
  private Double cxPresupuestoAnual;
  @Column(name = "cb_productos_asociados")
  private String cbProductosAsociados;
  @Column(name = "df_presupuesto")
  private Date dfPresupuesto;
  @Column(name = "dh_presupuesto")
  private Time dhPresupuesto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cve_usuario")
  private Usuario usuario;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_producto")
  private Producto producto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_centro_costo", updatable = false, insertable = false)
  private MasterCatalogo catalogoCentroCosto;
  @Column(name = "id_catalogo_centro_costo")
  private Integer idCatalogoCentroCosto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_fuente", updatable = false, insertable = false)
  private MasterCatalogo catalogoFuente;
  @Column(name = "id_catalogo_fuente")
  private Integer idCatalogoFuente;
  @Column(name = "cs_estatus")
  private String csEstatus;

  @OneToMany(mappedBy = "presupuesto", fetch = FetchType.EAGER)
  private List<PartidaGasto> partidasGasto = new ArrayList<>();

  @OneToOne(mappedBy = "presupuestoModificacion")
  private AdecuacionAccion adecuacionAccion;
  @OneToOne(mappedBy = "presupuestoModificacion")
  private AdecuacionPresupuesto adecuacionPresupuesto;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    Presupuesto that = (Presupuesto) o;
    return getIdPresupuesto() != null && Objects.equals(getIdPresupuesto(), that.getIdPresupuesto());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idPresupuesto = " + idPresupuesto + ")";
  }

  public void addPartidasGasto(PartidaGasto partidaGasto) {
    this.partidasGasto.add(partidaGasto);
  }

}
