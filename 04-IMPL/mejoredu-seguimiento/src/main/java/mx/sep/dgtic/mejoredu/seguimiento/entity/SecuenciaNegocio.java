// Generated with g9.

package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.*;

@Entity(name="vt_secuencia_negocio")
public class SecuenciaNegocio implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = -21976035763960917L;

	/** Primary key. */
    protected static final String PK = "idSecuencia";

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_secuencia", unique=true, nullable=false, precision=10)
    private Integer idSecuencia;
    @Column(name="ix_secuencia", precision=10)
    private Integer ixSecuencia;
    
    @ManyToOne
    @JoinColumn(name = "id_unidad_admiva")
    private MasterCatalogo unidadAdmiva;
    
    

    public MasterCatalogo getUnidadAdmiva() {
		return unidadAdmiva;
	}

	public void setUnidadAdmiva(MasterCatalogo unidadAdmiva) {
		this.unidadAdmiva = unidadAdmiva;
	}

	/** Default constructor. */
    public SecuenciaNegocio() {
        super();
    }

    /**
     * Access method for idSecuencia.
     *
     * @return the current value of idSecuencia
     */
    public Integer getIdSecuencia() {
        return idSecuencia;
    }

    /**
     * Setter method for idSecuencia.
     *
     * @param aIdSecuencia the new value for idSecuencia
     */
    public void setIdSecuencia(Integer aIdSecuencia) {
        idSecuencia = aIdSecuencia;
    }

    /**
     * Access method for ixSecuencia.
     *
     * @return the current value of ixSecuencia
     */
    public Integer getIxSecuencia() {
        return ixSecuencia;
    }

    /**
     * Setter method for ixSecuencia.
     *
     * @param aIxSecuencia the new value for ixSecuencia
     */
    public void setIxSecuencia(Integer aIxSecuencia) {
        ixSecuencia = aIxSecuencia;
    }

    /**
     * Compares the key for this instance with another SecuenciaNegocio.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class SecuenciaNegocio and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof SecuenciaNegocio)) {
            return false;
        }
        SecuenciaNegocio that = (SecuenciaNegocio) other;
        if (this.getIdSecuencia() != that.getIdSecuencia()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another SecuenciaNegocio.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof SecuenciaNegocio)) return false;
        return this.equalKeys(other) && ((SecuenciaNegocio)other).equalKeys(this);
    }

    /**
     * Returns a hash code for this instance.
     *
     * @return Hash code
     */
    @Override
    public int hashCode() {
    	Integer i;
    	Integer result = 17;
        i = getIdSecuencia();
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
        StringBuffer sb = new StringBuffer("[SecuenciaNegocio |");
        sb.append(" idSecuencia=").append(getIdSecuencia());
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
        ret.put("idSecuencia", Integer.valueOf(getIdSecuencia()));
        return ret;
    }

}
