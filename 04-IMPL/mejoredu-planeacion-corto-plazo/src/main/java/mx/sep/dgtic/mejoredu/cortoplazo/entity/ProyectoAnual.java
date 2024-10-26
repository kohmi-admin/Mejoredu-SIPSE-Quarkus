package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "met_cortoplazo_proyecto")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProyectoAnual {
  protected static final String PK = "idProyecto";

  /**
   * The optimistic lock. Available via standard bean get/set operations.
   */
  @Version
  @Column(name = "LOCK_FLAG")
  private Integer lockFlag;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_proyecto", unique = true, nullable = false, precision = 10)
  private Integer idProyecto;
  @Column(name = "cve_proyecto", nullable = false, precision = 10)
  private int cveProyecto;
  @Column(name = "cx_nombre_proyecto", nullable = false, length = 90)
  private String cxNombreProyecto;
  @Column(name = "cx_objetivo", nullable = false, length = 100)
  private String cxObjetivo;
  @Column(name = "cx_objetivo_prioritario", nullable = true, length = 300)
  private String cxObjetivoPrioritario;
  @Column(name = "df_proyecto")
  private LocalDate dfProyecto;
  @Column(name = "dh_proyecto")
  private LocalTime dhProyecto;
  @Column(name = "cs_estatus", length = 1)
  private String csEstatus;
  @Column(name = "cx_nombre_unidad", length = 90)
  private String cxNombreUnidad;
  @Column(name = "cve_unidad", length = 45)
  private String cveUnidad;
  @Column(name = "cx_alcance", length = 200)
  private String cxAlcance;
  @Column(name = "cx_fundamentacion", length = 200)
  private String cxFundamentacion;
  @Column(name = "ix_fuente_registro", length = 1)
  private Integer ix_fuente_registro;
  @OneToMany(mappedBy = "proyectoAnual")
  private List<ProyectoContribucion> proyectoContribucion = new ArrayList<>();
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "id_anhio", nullable = true)
  private AnhoPlaneacion anhoPlaneacion;
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "id_archivo", nullable = true)
  private Archivo archivo;
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "cve_usuario", nullable = true)
  private Usuario usuario;
  @Column(name = "df_actualizacion", length = 45)
  private LocalDate dfactualizacion;
  @Column(name = "dh_actualizacion", length = 45)
  private LocalTime dhActualizacion;
  @Column(name = "cve_usuario_actualiza", length = 45)
  private String cveUsuarioActualiza;
  @Column(name = "id_validacion", nullable = true)
  private Integer idValidacion;

  @Column(name = "id_validacion_planeacion", nullable = true)
  private Integer idValidacionPlaneacion;

  @Column(name = "id_validacion_supervisor", nullable = true)
  private Integer idValidacionSupervisor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_unidad")
  private MasterCatalogo unidadAdministrativa;

  @Column(name = "ix_cicloValidacion", nullable = true)
  private Integer ixCicloValidacion;
  @Column(name = "ix_accion", nullable = true)
  private Integer ixAccion;
  @Column(name = "it_semantica", length = 1)
  private Integer itSemantica;

  @OneToOne(mappedBy = "proyectoModificacion")
  private AdecuacionProyecto adecuacionProyecto;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    ProyectoAnual that = (ProyectoAnual) o;
    return getIdProyecto() != null && Objects.equals(getIdProyecto(), that.getIdProyecto());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idProyecto = " + idProyecto + ")";
  }
}
