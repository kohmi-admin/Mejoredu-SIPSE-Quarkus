// Generated with g9.

package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

@Entity(name = "seg_perfil_laboral")
public class PerfilLaboral implements Serializable {

  /**
   *
   */
  private static final long serialVersionUID = 743281368474243931L;

  /**
   * Primary key.
   */
  protected static final String PK = "idPerfilLaboral";

  /**
   * The optimistic lock. Available via standard bean get/set operations.
   */
  @Version
  @Column(name = "LOCK_FLAG")
  private Integer lockFlag;

  /**
   * Access method for the lockFlag property.
   *
   * @return the current value of the lockFlag property
   */
  public Integer getLockFlag() {
    return lockFlag;
  }

  /**
   * Sets the value of the lockFlag property.
   *
   * @param aLockFlag the new value of the lockFlag property
   */
  public void setLockFlag(Integer aLockFlag) {
    lockFlag = aLockFlag;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_perfil_laboral", unique = true, nullable = false, precision = 10)
  private int idPerfilLaboral;
  @Column(name = "ci_numero_empleado", precision = 10)
  private int ciNumeroEmpleado;
  @Column(name = "cx_puesto", length = 120)
  private String cxPuesto;
  @Column(name = "cx_telefono_oficina", length = 45)
  private String cxTelefonoOficina;
  @Column(name = "cx_extension", length = 45)
  private String cxExtension;
  @Column(name = "cx_dg_administacion", length = 45)
  private String cxDgAdministacion;
  @Column(name = "cs_status", length = 1)
  private String csStatus;
  @Column(name = "id_catalogo_area", nullable = false)
  private Integer idArea;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_unidad", nullable = true, updatable = false, insertable = false)
  private CatMasterCatalogo catalogoUnidad;
  @Column(name = "id_catalogo_unidad", nullable = true)
  private Integer idCatalogoUnidad;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_direccion", nullable = true)
  private CatMasterCatalogo catalogoDireccion;
  @ManyToOne(optional = false)
  @JoinColumn(name = "cve_usuario", nullable = false, updatable = false, insertable = false)
  private Usuario usuario;
  @Column(name = "cve_usuario", nullable = false)
  private String cveUsuario;


  public CatMasterCatalogo getCatalogoUnidad() {
    return catalogoUnidad;
  }

  public void setCatalogoUnidad(CatMasterCatalogo catalogoUnidad) {
    this.catalogoUnidad = catalogoUnidad;
  }

  public CatMasterCatalogo getCatalogoDireccion() {
    return catalogoDireccion;
  }

  public void setCatalogoDireccion(CatMasterCatalogo catalogoDireccion) {
    this.catalogoDireccion = catalogoDireccion;
  }

  /**
   * Default constructor.
   */
  public PerfilLaboral() {
    super();
  }

  /**
   * Access method for idPerfilLaboral.
   *
   * @return the current value of idPerfilLaboral
   */
  public int getIdPerfilLaboral() {
    return idPerfilLaboral;
  }

  /**
   * Setter method for idPerfilLaboral.
   *
   * @param aIdPerfilLaboral the new value for idPerfilLaboral
   */
  public void setIdPerfilLaboral(int aIdPerfilLaboral) {
    idPerfilLaboral = aIdPerfilLaboral;
  }

  /**
   * Access method for ciNumeroEmpleado.
   *
   * @return the current value of ciNumeroEmpleado
   */
  public int getCiNumeroEmpleado() {
    return ciNumeroEmpleado;
  }

  /**
   * Setter method for ciNumeroEmpleado.
   *
   * @param aCiNumeroEmpleado the new value for ciNumeroEmpleado
   */
  public void setCiNumeroEmpleado(int aCiNumeroEmpleado) {
    ciNumeroEmpleado = aCiNumeroEmpleado;
  }

  /**
   * Access method for cxPuesto.
   *
   * @return the current value of cxPuesto
   */
  public String getCxPuesto() {
    return cxPuesto;
  }

  /**
   * Setter method for cxPuesto.
   *
   * @param aCxPuesto the new value for cxPuesto
   */
  public void setCxPuesto(String aCxPuesto) {
    cxPuesto = aCxPuesto;
  }

  /**
   * Access method for cxTelefonoOficina.
   *
   * @return the current value of cxTelefonoOficina
   */
  public String getCxTelefonoOficina() {
    return cxTelefonoOficina;
  }

  /**
   * Setter method for cxTelefonoOficina.
   *
   * @param aCxTelefonoOficina the new value for cxTelefonoOficina
   */
  public void setCxTelefonoOficina(String aCxTelefonoOficina) {
    cxTelefonoOficina = aCxTelefonoOficina;
  }

  /**
   * Access method for cxExtension.
   *
   * @return the current value of cxExtension
   */
  public String getCxExtension() {
    return cxExtension;
  }

  /**
   * Setter method for cxExtension.
   *
   * @param aCxExtension the new value for cxExtension
   */
  public void setCxExtension(String aCxExtension) {
    cxExtension = aCxExtension;
  }

  /**
   * Access method for cxDgAdministacion.
   *
   * @return the current value of cxDgAdministacion
   */
  public String getCxDgAdministacion() {
    return cxDgAdministacion;
  }

  /**
   * Setter method for cxDgAdministacion.
   *
   * @param aCxDgAdministacion the new value for cxDgAdministacion
   */
  public void setCxDgAdministacion(String aCxDgAdministacion) {
    cxDgAdministacion = aCxDgAdministacion;
  }

  /**
   * Access method for csStatus.
   *
   * @return the current value of csStatus
   */
  public String getCsStatus() {
    return csStatus;
  }

  /**
   * Setter method for csStatus.
   *
   * @param aCsStatus the new value for csStatus
   */
  public void setCsStatus(String aCsStatus) {
    csStatus = aCsStatus;
  }

  /**
   * Access method for masterCatalogo.
   *
   * @return the current value of masterCatalogo
   */
  public Integer getIdArea() {
    return this.idArea;
  }

  /**
   * Setter method for masterCatalogo.
   *
   * @param idArea the new value for masterCatalogo
   */
  public void setIdArea(Integer idArea) {
    this.idArea = idArea;
  }

  /**
   * Access method for usuario.
   *
   * @return the current value of usuario
   */
  public Usuario getUsuario() {
    return usuario;
  }

  /**
   * Setter method for usuario.
   *
   * @param aUsuario the new value for usuario
   */
  public void setUsuario(Usuario aUsuario) {
    usuario = aUsuario;
  }

  /**
   * Compares the key for this instance with another PerfilLaboral.
   *
   * @param other The object to compare to
   * @return True if other object is instance of class PerfilLaboral and the key objects are equal
   */
  private boolean equalKeys(Object other) {
    if (this == other) {
      return true;
    }
    if (!(other instanceof PerfilLaboral that)) {
      return false;
    }
    return this.getIdPerfilLaboral() == that.getIdPerfilLaboral();
  }

  /**
   * Compares this instance with another PerfilLaboral.
   *
   * @param other The object to compare to
   * @return True if the objects are the same
   */
  @Override
  public boolean equals(Object other) {
    if (!(other instanceof PerfilLaboral)) return false;
    return this.equalKeys(other) && ((PerfilLaboral) other).equalKeys(this);
  }

  /**
   * Returns a hash code for this instance.
   *
   * @return Hash code
   */
  @Override
  public int hashCode() {
    int i;
    int result = 17;
    i = getIdPerfilLaboral();
    result = 37 * result + i;
    return result;
  }

  /**
   * Returns a debug-friendly String representation of this instance.
   *
   * @return String representation of this instance
   */
  @Override
  public String toString() {
    String sb = "[PerfilLaboral |" + " idPerfilLaboral=" + getIdPerfilLaboral() +
            "]";
    return sb;
  }

  /**
   * Return all elements of the primary key.
   *
   * @return Map of key names to values
   */
  public Map<String, Object> getPrimaryKey() {
    Map<String, Object> ret = new LinkedHashMap<String, Object>(6);
    ret.put("idPerfilLaboral", Integer.valueOf(getIdPerfilLaboral()));
    return ret;
  }

    public Integer getIdCatalogoUnidad() {
        return idCatalogoUnidad;
    }

    public void setIdCatalogoUnidad(Integer idCatalogoUnidad) {
        this.idCatalogoUnidad = idCatalogoUnidad;
    }

    public String getCveUsuario() {
        return cveUsuario;
    }

    public void setCveUsuario(String cveUsuario) {
        this.cveUsuario = cveUsuario;
    }
}
