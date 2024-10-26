// Generated with g9.

package mx.sep.dgtic.sipse.medianoplazo.entidades;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.*;

@Entity(name="met_mp_aplicacion_metodo")
public class AplicacionMetodo implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** Primary key. */
    protected static final String PK = "idAplicacion";

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
    @Column(name="id_aplicacion", unique=true, nullable=false, precision=10)
    private int idAplicacion;
    @Column(name="cx_nombre_variable", length=120)
    private String cxNombreVariable;
    @Column(name="cx_valor_variable", length=120)
    private String cxValorVariable;
    @Column(name="cx_fuente", length=120)
    private String cxFuente;
    @Column(name="cx_variable_dos", length=120)
    private String cxVariableDos;
    @Column(name="cx_valor_varable_dos", length=120)
    private String cxValorVarableDos;
    @Column(name="cx_fuente_dos", length=120)
    private String cxFuenteDos;
    @Column(name="cx_sustitucion", length=120)
    private String cxSustitucion;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_meta", nullable=false)
    private Meta meta;

    /** Default constructor. */
    public AplicacionMetodo() {
        super();
    }

    /**
     * Access method for idAplicacion.
     *
     * @return the current value of idAplicacion
     */
    public int getIdAplicacion() {
        return idAplicacion;
    }

    /**
     * Setter method for idAplicacion.
     *
     * @param aIdAplicacion the new value for idAplicacion
     */
    public void setIdAplicacion(int aIdAplicacion) {
        idAplicacion = aIdAplicacion;
    }

    /**
     * Access method for cxNombreVariable.
     *
     * @return the current value of cxNombreVariable
     */
    public String getCxNombreVariable() {
        return cxNombreVariable;
    }

    /**
     * Setter method for cxNombreVariable.
     *
     * @param aCxNombreVariable the new value for cxNombreVariable
     */
    public void setCxNombreVariable(String aCxNombreVariable) {
        cxNombreVariable = aCxNombreVariable;
    }

    /**
     * Access method for cxValorVariable.
     *
     * @return the current value of cxValorVariable
     */
    public String getCxValorVariable() {
        return cxValorVariable;
    }

    /**
     * Setter method for cxValorVariable.
     *
     * @param aCxValorVariable the new value for cxValorVariable
     */
    public void setCxValorVariable(String aCxValorVariable) {
        cxValorVariable = aCxValorVariable;
    }

    /**
     * Access method for cxFuente.
     *
     * @return the current value of cxFuente
     */
    public String getCxFuente() {
        return cxFuente;
    }

    /**
     * Setter method for cxFuente.
     *
     * @param aCxFuente the new value for cxFuente
     */
    public void setCxFuente(String aCxFuente) {
        cxFuente = aCxFuente;
    }

    /**
     * Access method for cxVariableDos.
     *
     * @return the current value of cxVariableDos
     */
    public String getCxVariableDos() {
        return cxVariableDos;
    }

    /**
     * Setter method for cxVariableDos.
     *
     * @param aCxVariableDos the new value for cxVariableDos
     */
    public void setCxVariableDos(String aCxVariableDos) {
        cxVariableDos = aCxVariableDos;
    }

    /**
     * Access method for cxValorVarableDos.
     *
     * @return the current value of cxValorVarableDos
     */
    public String getCxValorVarableDos() {
        return cxValorVarableDos;
    }

    /**
     * Setter method for cxValorVarableDos.
     *
     * @param aCxValorVarableDos the new value for cxValorVarableDos
     */
    public void setCxValorVarableDos(String aCxValorVarableDos) {
        cxValorVarableDos = aCxValorVarableDos;
    }

    /**
     * Access method for cxFuenteDos.
     *
     * @return the current value of cxFuenteDos
     */
    public String getCxFuenteDos() {
        return cxFuenteDos;
    }

    /**
     * Setter method for cxFuenteDos.
     *
     * @param aCxFuenteDos the new value for cxFuenteDos
     */
    public void setCxFuenteDos(String aCxFuenteDos) {
        cxFuenteDos = aCxFuenteDos;
    }

    /**
     * Access method for cxSustitucion.
     *
     * @return the current value of cxSustitucion
     */
    public String getCxSustitucion() {
        return cxSustitucion;
    }

    /**
     * Setter method for cxSustitucion.
     *
     * @param aCxSustitucion the new value for cxSustitucion
     */
    public void setCxSustitucion(String aCxSustitucion) {
        cxSustitucion = aCxSustitucion;
    }

    /**
     * Access method for meta.
     *
     * @return the current value of meta
     */
    public Meta getMeta() {
        return meta;
    }

    /**
     * Setter method for meta.
     *
     * @param aMeta the new value for meta
     */
    public void setMeta(Meta aMeta) {
        meta = aMeta;
    }

    /**
     * Compares the key for this instance with another AplicacionMetodo.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class AplicacionMetodo and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof AplicacionMetodo)) {
            return false;
        }
        AplicacionMetodo that = (AplicacionMetodo) other;
        if (this.getIdAplicacion() != that.getIdAplicacion()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another AplicacionMetodo.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof AplicacionMetodo)) return false;
        return this.equalKeys(other) && ((AplicacionMetodo)other).equalKeys(this);
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
        i = getIdAplicacion();
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
        StringBuffer sb = new StringBuffer("[AplicacionMetodo |");
        sb.append(" idAplicacion=").append(getIdAplicacion());
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
        ret.put("idAplicacion", Integer.valueOf(getIdAplicacion()));
        return ret;
    }

}
