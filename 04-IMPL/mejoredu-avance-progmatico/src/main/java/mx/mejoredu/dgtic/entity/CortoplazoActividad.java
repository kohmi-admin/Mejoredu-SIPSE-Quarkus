package mx.mejoredu.dgtic.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

@Entity
@Table(name = "met_cortoplazo_actividad")
@Setter
@Getter
public class CortoplazoActividad {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_actividad", nullable = false)
  private Integer idActividad;
  @Column(name = "cve_actividad", nullable = false)
  private Integer cveActividad;
  @Column(name = "cx_nombre_actividad", nullable = false, length = 200)
  private String cxNombreActividad;
  @Column(name = "cx_descripcion", nullable = true, length = 600)
  private String cxDescripcion;
  @Column(name = "cx_articulacion_actividad", nullable = true, length = 2000)
  private String cxArticulacionActividad;
  @Column(name = "cb_actividad_interunidades", nullable = true, length = 70)
  private String cbActividadInterunidades;
  @Column(name = "cve_usuario", nullable = false, length = 45)
  private String cveUsuario;
  @Column(name = "df_actividad", nullable = true)
  private LocalDate dfActividad;
  @Column(name = "dh_actividad", nullable = true)
  private LocalTime dhActividad;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_proyecto", referencedColumnName = "id_proyecto", updatable = false, insertable = false)
  private Proyecto proyecto;
  @Column(name = "id_proyecto", nullable = false)
  private int idProyecto;
  @Column(name = "ic_actividad_transversal", nullable = true)
  private Integer icActividadTransversal;
  @Column(name = "ix_requiere_reunion", nullable = true)
  private Integer ixRequiereReunion;
  @Column(name = "cx_tema", nullable = true, length = 100)
  private String cxTema;
  @Column(name = "id_catalogo_alcance", nullable = true)
  private Integer idCatalogoAlcance;
  @Column(name = "cx_lugar", nullable = true, length = 100)
  private String cxLugar;
  @Column(name = "cx_actores", nullable = true, length = 300)
  private String cxActores;
  @Column(name = "cs_estatus", nullable = true, length = 1)
  private String csEstatus;
  @Column(name = "id_validacion", nullable = true)
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion", nullable = true)
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor", nullable = true)
  private Integer idValidacionSupervisor;
  @Column(name = "it_semantica", nullable = true)
  private Integer itSemantica;
  @Column(name = "ix_accion", nullable = true)
  private Integer ixAccion;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_espejo", referencedColumnName = "id_actividad")
  private CortoplazoActividad espejo;

  @OneToMany(mappedBy = "cortoplazoActividad")
  private Collection<Avance> avances;

  @OneToMany(mappedBy = "actividad")
  private Set<Producto> producto = new HashSet<>();

  @OneToMany(mappedBy = "cortoplazoActividad")
  private Set<RevisionTrimestral> revisionTrimestral = new HashSet<>();

  @OneToMany(mappedBy = "actividadModificacion")
  private Set<AdecuacionActividad> adecuacionActividad = new HashSet<>();
  @OneToMany(mappedBy = "actividadReferencia")
  private Set<AdecuacionActividad> adecuacionActividadReferencia = new HashSet<>();

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idActividad = " + idActividad + ")";
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    CortoplazoActividad that = (CortoplazoActividad) o;
    return getIdActividad() != null && Objects.equals(getIdActividad(), that.getIdActividad());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

}
