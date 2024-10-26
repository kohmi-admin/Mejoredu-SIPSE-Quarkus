// Generated with g9.

package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

@Entity
@Table(name = "seg_perfil_laboral")
@Getter @Setter
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
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_unidad", nullable = true, updatable = false, insertable = false)
  private MasterCatalogo catalogoUnidad;
  @Column(name = "id_catalogo_unidad", nullable = true)
  private Integer idCatalogoUnidad;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_catalogo_direccion", nullable = true)
  private MasterCatalogo catalogoDireccion;
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "cve_usuario", nullable = false, updatable = false, insertable = false)
  private Usuario usuario;
  @Column(name = "cve_usuario", nullable = false)
  private String cveUsuario;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_archivo")
  private Archivo archivoFirma;


  /**
   * Default constructor.
   */
  public PerfilLaboral() {
    super();
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
}
