package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

@Entity
@Table(name = "met_cortoplazo_presupuesto")
@Setter @Getter
public class Presupuesto {
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
  @ManyToOne
  @JoinColumn(name = "cve_usuario")
  private Usuario usuario;
  @ManyToOne
  @JoinColumn(name = "id_producto")
  private Producto producto;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_centro_costo", updatable = false, insertable = false)
  private MasterCatalogo catalogoCentroCosto;
  @Column(name = "id_catalogo_centro_costo")
  private Integer idCatalogoCentroCosto;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_fuente", updatable = false, insertable = false)
  private MasterCatalogo catalogoFuente;
  @Column(name = "id_catalogo_fuente")
  private Integer idCatalogoFuente;
  @Column(name = "cs_estatus")
  private String csEstatus;
  @Column(name = "id_validacion", nullable = true)
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion", nullable = true)
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor", nullable = true)
  private Integer idValidacionSupervisor;
  @Column(name = "cve_unidad")
  private String cveUnidad;
  @OneToMany(mappedBy = "presupuesto", fetch = FetchType.EAGER)
  private Set<PartidaGasto> partidasGasto = new HashSet<>();

  @OneToMany(mappedBy = "accionModificacion")
  private List<AdecuacionAccion> adecuacionAccion = new ArrayList<>();
  @OneToMany(mappedBy = "accionReferencia")
  private List<AdecuacionAccion> adecuacionAccionReferencia = new ArrayList<>();

  @OneToMany(mappedBy = "presupuestoModificacion")
  private List<AdecuacionPresupuesto> adecuacionPresupuesto = new ArrayList<>();
  @OneToMany(mappedBy = "presupuestoReferencia")
  private List<AdecuacionPresupuesto> adecuacionPresupuestoReferencia = new ArrayList<>();

  public void addPartidasGasto(PartidaGasto partidaGasto) {
    this.partidasGasto.add(partidaGasto);
  }

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
    return getClass().getSimpleName() + "(" + "idPresupuesto = " + idPresupuesto + ")";
  }

}
