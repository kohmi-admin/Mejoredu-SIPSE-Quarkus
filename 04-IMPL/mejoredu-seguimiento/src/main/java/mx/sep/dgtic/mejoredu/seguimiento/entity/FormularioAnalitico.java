package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;
import java.util.Set;

@Entity(name = "met_formulario_analitico")
public class FormularioAnalitico {
  /**
   * Primary key.
   */
  protected static final String PK = "idFormulario";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_formulario", unique = true, nullable = false, precision = 10)
  private int idFormulario;
  @Column(name = "cx_nombre_unidad")
  private String cxNombreUnidad;
  @Column(name = "cc_clave")
  private String ccClave;
  @Column(name = "cx_nombre_proyecto")
  private String cxNombreProyecto;
  @Column(name = "cx_objetivo")
  private String cxObjetivo;
  @Column(name = "cx_fundamentacion")
  private String cxFundamentacion;
  @Column(name = "cx_alcance")
  private String cxAlcance;
  @Column(name = "cx_contribucion_pi")
  private String cxContribucionPI;
  @Column(name = "cx_contribucion_pnd")
  private String cxContribucionPND;

  @Column(name = "df_registro")
  private String dfRegistro;

  @Column(name = "dh_registro")
  private String dhRegistro;

  @ManyToOne(optional = false)
  @JoinColumn(name = "cve_usuario", nullable = false)
  private Usuario usuario;

  @ManyToOne(optional = false)
  @JoinColumn(name = "id_anhio", nullable = false)
  private AnhoPlaneacion anhoPlaneacion;

  @ManyToMany
  @JoinTable(name = "met_formulario_archivo",
          joinColumns = @JoinColumn(name = "id_formulario"),
          inverseJoinColumns = @JoinColumn(name = "id_archivo"))
  private Set<Archivo> archivos;

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idFormulario = " + idFormulario + ")";
  }

  public Set<Archivo> getArchivos() {
    return archivos;
  }

  public void setArchivos(Set<Archivo> archivos) {
    this.archivos = archivos;
  }

  public String getDfRegistro() {
    return dfRegistro;
  }

  public void setDfRegistro(String dfRegistro) {
    this.dfRegistro = dfRegistro;
  }

  public String getDhRegistro() {
    return dhRegistro;
  }

  public void setDhRegistro(String dhRegistro) {
    this.dhRegistro = dhRegistro;
  }

  public AnhoPlaneacion getAnhoPlaneacion() {
    return anhoPlaneacion;
  }

  public void setAnhoPlaneacion(AnhoPlaneacion anhoPlaneacion) {
    this.anhoPlaneacion = anhoPlaneacion;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    FormularioAnalitico that = (FormularioAnalitico) o;
    return Objects.equals(idFormulario, that.idFormulario);
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  public int getIdFormulario() {
    return idFormulario;
  }

  public void setIdFormulario(int idFormulario) {
    this.idFormulario = idFormulario;
  }

  public String getCxNombreUnidad() {
    return cxNombreUnidad;
  }

  public void setCxNombreUnidad(String cxNombreUnidad) {
    this.cxNombreUnidad = cxNombreUnidad;
  }

  public String getCcClave() {
    return ccClave;
  }

  public void setCcClave(String ccClave) {
    this.ccClave = ccClave;
  }

  public String getCxNombreProyecto() {
    return cxNombreProyecto;
  }

  public void setCxNombreProyecto(String cxNombreProyecto) {
    this.cxNombreProyecto = cxNombreProyecto;
  }

  public String getCxObjetivo() {
    return cxObjetivo;
  }

  public void setCxObjetivo(String cxObjetivo) {
    this.cxObjetivo = cxObjetivo;
  }

  public String getCxFundamentacion() {
    return cxFundamentacion;
  }

  public void setCxFundamentacion(String cxFundamentacion) {
    this.cxFundamentacion = cxFundamentacion;
  }

  public String getCxAlcance() {
    return cxAlcance;
  }

  public void setCxAlcance(String cxAlcance) {
    this.cxAlcance = cxAlcance;
  }

  public String getCxContribucionPI() {
    return cxContribucionPI;
  }

  public void setCxContribucionPI(String cxContribucionPI) {
    this.cxContribucionPI = cxContribucionPI;
  }

  public String getCxContribucionPND() {
    return cxContribucionPND;
  }

  public void setCxContribucionPND(String cxContribucionPND) {
    this.cxContribucionPND = cxContribucionPND;
  }

  public Usuario getUsuario() {
    return usuario;
  }

  public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
  }
}
