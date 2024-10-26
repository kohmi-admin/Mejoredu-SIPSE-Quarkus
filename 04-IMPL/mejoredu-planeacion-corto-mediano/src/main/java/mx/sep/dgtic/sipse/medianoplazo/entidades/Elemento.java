// Generated with g9.

package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

@Entity(name = "met_mp_elemento")
@Getter
@Setter
public class Elemento implements Serializable {
  private static final long serialVersionUID = 1L;

  /**
   * Primary key.
   */
  protected static final String PK = "idElemento";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_elemento", unique = true, nullable = false, precision = 10)
  private Integer idElemento;
  @Column(name = "cx_nombre", length = 90)
  private String cxNombre;

  @ManyToOne(optional = false)
  @JoinColumn(name = "id_catalogo_objetivo", nullable = false)
  private MasterCatalogo objetivo;

  @Column(name = "cx_definicion", length = 120)
  private String cxDefinicion;
  @Column(name = "cx_periodo", length = 120)
  private String cxPeriodo;
  @Column(name = "cx_unidad_medida", length = 120)
  private String cxUnidadMedida;
  @Column(name = "cx_periodo_recoleccion", length = 120)
  private String cxPeriodoRecoleccion;
  @Column(name = "cx_metodo_calculo", length = 120)
  private String cxMetodoCalculo;
  @Column(name = "cx_observacion", length = 120)
  private String cxObservacion;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_nivel_desagregacion")
  private MasterCatalogo nivelDesagregacion;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_unidad_responsable")
  private MasterCatalogo unidadResponsable;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_periodicidad")
  private MasterCatalogo MasterCatalogo2;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_tipo")
  private MasterCatalogo MasterCatalogo3;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_unidad_medida")
  private MasterCatalogo MasterCatalogo4;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_acumulado")
  private MasterCatalogo MasterCatalogo5;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_periodo_recoleccion")
  private MasterCatalogo MasterCatalogo6;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_dimension")
  private MasterCatalogo MasterCatalogo7;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_disponibilidad")
  private MasterCatalogo MasterCatalogo8;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_tendencia")
  private MasterCatalogo MasterCatalogo9;
  @ManyToOne(optional = false)
  @JoinColumn(name = "id_meta", nullable = false)
  private Meta meta;

  @OneToOne(optional = true)
  @JoinColumn(name = "id_catalogo_elemento", referencedColumnName = "id_catalogo", updatable = false, insertable = false)
  private MasterCatalogo catalogoElemento;

  @Column(name = "id_catalogo_elemento")
  private Integer idCatalogoElemento;

  /**
   * Default constructor.
   */
  public Elemento() {
    super();
  }

  public MasterCatalogo getIdCatalogoObjetivo() {
    return objetivo;
  }

  public void setIdCatalogoObjetivo(MasterCatalogo idCatalogoObjetivo) {
    this.objetivo = idCatalogoObjetivo;
  }

  /**
   * Compares the key for this instance with another Elemento.
   *
   * @param other The object to compare to
   * @return True if other object is instance of class Elemento and the key objects are equal
   */
  private boolean equalKeys(Object other) {
    if (this == other) {
      return true;
    }
    if (!(other instanceof Elemento)) {
      return false;
    }
    Elemento that = (Elemento) other;
    if (this.getIdElemento() != that.getIdElemento()) {
      return false;
    }
    return true;
  }

  /**
   * Compares this instance with another Elemento.
   *
   * @param other The object to compare to
   * @return True if the objects are the same
   */
  @Override
  public boolean equals(Object other) {
    if (!(other instanceof Elemento)) return false;
    return this.equalKeys(other) && ((Elemento) other).equalKeys(this);
  }


  /**
   * Returns a debug-friendly String representation of this instance.
   *
   * @return String representation of this instance
   */
  @Override
  public String toString() {
    StringBuffer sb = new StringBuffer("[Elemento |");
    sb.append(" idElemento=").append(getIdElemento());
    sb.append("]");
    return sb.toString();
  }

  /**
   * Return all elements of the primary key.
   *
   * @return Map of key names to values
   */
  public Map<String, Object> getPrimaryKey() {
    Map<String, Object> ret = new LinkedHashMap<String, Object>(6);
    ret.put("idElemento", Integer.valueOf(getIdElemento()));
    return ret;
  }

}
