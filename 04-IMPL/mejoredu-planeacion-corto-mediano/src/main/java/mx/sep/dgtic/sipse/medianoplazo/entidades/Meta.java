// Generated with g9.

package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity(name="met_mp_meta_parametro")
public class Meta implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** Primary key. */
    protected static final String PK = "idMetasBienestar";

    /**
     * The optimistic lock. Available via standard bean get/set operations.
     */
    @Version
    @Column(name="LOCK_FLAG")
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
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_metas_bienestar", unique=true, nullable=false, precision=10)
    private Integer idMetasBienestar;

    @Column(name="ix_tipo")
    private int ixTipo;
    @Column(name="cx_nombre", length=45)
    private String cxNombre;
    @Column(name="cx_meta", length=45)
    private String cxMeta;

    @Column(name="cx_periodicidad", length=45)
    private String cxPeriodicidad;

    @Column(name="cx_unidad_medida", length=45)
    private String cxUnidadMedida;

    @Column(name="cx_tendencia_esperada", length=45)
    private String cxTendenciaEsperada;

    @Column(name="cx_fuente_variable_uno", length=45)
    private String cxFuenteVariableUno;

    @Column(name="cs_estatus", length=1)
    private String csEstatus;
    @OneToMany(mappedBy="meta", cascade = CascadeType.ALL)
    private List<Elemento> elemento;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_estructura", nullable=false)
    private Estructura estructura;
    @ManyToOne(optional=false)
    @JoinColumn(name="cve_usuario", nullable=false)
    private Usuario segUsuario;
    @OneToMany(mappedBy="meta", cascade = CascadeType.ALL)
    private List<SerieMeta> serieMeta;
    @OneToMany(mappedBy="meta", cascade = CascadeType.ALL)
    private List<AplicacionMetodo> aplicacionMetodo;
    @OneToMany(mappedBy="meta", cascade = CascadeType.ALL)
    private List<LineaBase> lineaBase;

    @Column(name = "id_validacion", nullable = true)
    private Integer idValidacion;

    @Column(name = "id_validacion_planeacion", nullable = true)
    private Integer idValidacionPlaneacion;

    @Column(name = "id_validacion_supervisor", nullable = true)
    private Integer idValidacionSupervisor;

    /** Default constructor. */
    public Meta() {
        super();
    }

    public Integer getIdValidacion() {
        return idValidacion;
    }

    public void setIdValidacion(Integer idValidacion) {
        this.idValidacion = idValidacion;
    }

    public Integer getIdValidacionPlaneacion() {
        return idValidacionPlaneacion;
    }

    public void setIdValidacionPlaneacion(Integer idValidacionPlaneacion) {
        this.idValidacionPlaneacion = idValidacionPlaneacion;
    }

    public Integer getIdValidacionSupervisor() {
        return idValidacionSupervisor;
    }

    public void setIdValidacionSupervisor(Integer idValidacionSupervisor) {
        this.idValidacionSupervisor = idValidacionSupervisor;
    }

    /**
     * Access method for idMetasBienestar.
     *
     * @return the current value of idMetasBienestar
     */
    public Integer getIdMetasBienestar() {
        return idMetasBienestar;
    }

    /**
     * Setter method for idMetasBienestar.
     *
     * @param aIdMetasBienestar the new value for idMetasBienestar
     */
    public void setIdMetasBienestar(Integer aIdMetasBienestar) {
        idMetasBienestar = aIdMetasBienestar;
    }

    /**
     * Access method for cxNombre.
     *
     * @return the current value of cxNombre
     */
    public String getCxNombre() {
        return cxNombre;
    }

    /**
     * Setter method for cxNombre.
     *
     * @param aCxNombre the new value for cxNombre
     */
    public void setCxNombre(String aCxNombre) {
        cxNombre = aCxNombre;
    }

    /**
     * Access method for cxMeta.
     *
     * @return the current value of cxMeta
     */
    public String getCxMeta() {
        return cxMeta;
    }

    /**
     * Setter method for cxMeta.
     *
     * @param aCxMeta the new value for cxMeta
     */
    public void setCxMeta(String aCxMeta) {
        cxMeta = aCxMeta;
    }

    public String getCxPeriodicidad() {
        return cxPeriodicidad;
    }

    public int getIxTipo() {
        return ixTipo;
    }

    public void setIxTipo(int ixTipo) {
        this.ixTipo = ixTipo;
    }

    public void setCxPeriodicidad(String cxPeriodicidad) {
        this.cxPeriodicidad = cxPeriodicidad;
    }

    public String getCxUnidadMedida() {
        return cxUnidadMedida;
    }

    public void setCxUnidadMedida(String cxUnidadMedida) {
        this.cxUnidadMedida = cxUnidadMedida;
    }

    public String getCxTendenciaEsperada() {
        return cxTendenciaEsperada;
    }

    public void setCxTendenciaEsperada(String cxTendenciaEsperada) {
        this.cxTendenciaEsperada = cxTendenciaEsperada;
    }

    public String getCxFuenteVariableUno() {
        return cxFuenteVariableUno;
    }

    public void setCxFuenteVariableUno(String cxFuenteVariableUno) {
        this.cxFuenteVariableUno = cxFuenteVariableUno;
    }
    /**
     * Access method for cxPeriodicidad.
     *
     * @return the current value of cxPeriodicidad
     */

    /**
     * Setter method for cxPeriodicidad.
     *
     * @param aCxPeriodicidad the new value for cxPeriodicidad
     */

    /**
     * Access method for cxUnidadMedida.
     *
     * @return the current value of cxUnidadMedida
     */

    /**
     * Setter method for cxUnidadMedida.
     *
     * @param aCxUnidadMedida the new value for cxUnidadMedida
     */

    /**
     * Access method for cxTendenciaEsperada.
     *
     * @return the current value of cxTendenciaEsperada
     */

    /**
     * Setter method for cxTendenciaEsperada.
     *
     * @param aCxTendenciaEsperada the new value for cxTendenciaEsperada
     */

    /**
     * Access method for cxFuenteVariableUno.
     *
     * @return the current value of cxFuenteVariableUno
     */

    /**
     * Setter method for cxFuenteVariableUno.
     *
     * @param aCxFuenteVariableUno the new value for cxFuenteVariableUno
     */

    /**
     * Access method for csEstatus.
     *
     * @return the current value of csEstatus
     */
    public String getCsEstatus() {
        return csEstatus;
    }

    /**
     * Setter method for csEstatus.
     *
     * @param aCsEstatus the new value for csEstatus
     */
    public void setCsEstatus(String aCsEstatus) {
        csEstatus = aCsEstatus;
    }

    /**
     * Access method for elemento.
     *
     * @return the current value of elemento
     */
    public List<Elemento> getElemento() {
        return elemento;
    }

    /**
     * Setter method for elemento.
     *
     * @param aElemento the new value for elemento
     */
    public void setElemento(List<Elemento> aElemento) {
        elemento = aElemento;
    }

    /**
     * Access method for estructura.
     *
     * @return the current value of estructura
     */
    public Estructura getEstructura() {
        return estructura;
    }

    /**
     * Setter method for estructura.
     *
     * @param aEstructura the new value for estructura
     */
    public void setEstructura(Estructura aEstructura) {
        estructura = aEstructura;
    }

    /**
     * Access method for segUsuario.
     *
     * @return the current value of segUsuario
     */
    public Usuario getSegUsuario() {
        return segUsuario;
    }

    /**
     * Setter method for segUsuario.
     *
     * @param aSegUsuario the new value for segUsuario
     */
    public void setSegUsuario(Usuario aSegUsuario) {
        segUsuario = aSegUsuario;
    }

    /**
     * Access method for serieMeta.
     *
     * @return the current value of serieMeta
     */
    public List<SerieMeta> getSerieMeta() {
        return serieMeta;
    }

    /**
     * Setter method for serieMeta.
     *
     * @param aSerieMeta the new value for serieMeta
     */
    public void setSerieMeta(List<SerieMeta> aSerieMeta) {
        serieMeta = aSerieMeta;
    }

    /**
     * Access method for aplicacionMetodo.
     *
     * @return the current value of aplicacionMetodo
     */
    public List<AplicacionMetodo> getAplicacionMetodo() {
        return aplicacionMetodo;
    }

    /**
     * Setter method for aplicacionMetodo.
     *
     * @param aAplicacionMetodo the new value for aplicacionMetodo
     */
    public void setAplicacionMetodo(List<AplicacionMetodo> aAplicacionMetodo) {
        aplicacionMetodo = aAplicacionMetodo;
    }

    /**
     * Access method for lineaBase.
     *
     * @return the current value of lineaBase
     */
    public List<LineaBase> getLineaBase() {
        return lineaBase;
    }

    /**
     * Setter method for lineaBase.
     *
     * @param aLineaBase the new value for lineaBase
     */
    public void setLineaBase(List<LineaBase> aLineaBase) {
        lineaBase = aLineaBase;
    }

    /**
     * Compares the key for this instance with another Meta.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class Meta and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof Meta)) {
            return false;
        }
        Meta that = (Meta) other;
        if (this.getIdMetasBienestar() != that.getIdMetasBienestar()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another Meta.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Meta)) return false;
        return this.equalKeys(other) && ((Meta)other).equalKeys(this);
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
        i = getIdMetasBienestar();
        result = 37*result + i;
        return result;
    }

    /**
     * Returns a debug-friendly String representation of this instance.
     *
     * @return String representation of this instance
     */
    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer("[Meta |");
        sb.append(" idMetasBienestar=").append(getIdMetasBienestar());
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
        ret.put("idMetasBienestar", Integer.valueOf(getIdMetasBienestar()));
        return ret;
    }

}
