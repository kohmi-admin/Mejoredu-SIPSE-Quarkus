// Generated with g9.

package mx.sep.dgtic.sipse.medianoplazo.entidades;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.*;

@Entity(name="met_mp_serie_meta")
public class SerieMeta implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** Primary key. */
    protected static final String PK = "idSerie";

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
    @Column(name="id_serie", unique=true, nullable=false, precision=10)
    private int idSerie;
    @Column(name="ix_tipo", length=45)
    private String ixTipo;
    @Column(name="ix_anhio", precision=10)
    private int ixAnhio;
    @Column(name="cx_descripcion", length=120)
    private String cxDescripcion;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_meta", nullable=false)
    private Meta meta;

    /** Default constructor. */
    public SerieMeta() {
        super();
    }

    /**
     * Access method for idSerie.
     *
     * @return the current value of idSerie
     */
    public int getIdSerie() {
        return idSerie;
    }

    /**
     * Setter method for idSerie.
     *
     * @param aIdSerie the new value for idSerie
     */
    public void setIdSerie(int aIdSerie) {
        idSerie = aIdSerie;
    }

    /**
     * Access method for ixTipo.
     *
     * @return the current value of ixTipo
     */
    public String getIxTipo() {
        return ixTipo;
    }

    /**
     * Setter method for ixTipo.
     *
     * @param aIxTipo the new value for ixTipo
     */
    public void setIxTipo(String aIxTipo) {
        ixTipo = aIxTipo;
    }

    /**
     * Access method for ixAnhio.
     *
     * @return the current value of ixAnhio
     */
    public int getIxAnhio() {
        return ixAnhio;
    }

    /**
     * Setter method for ixAnhio.
     *
     * @param aIxAnhio the new value for ixAnhio
     */
    public void setIxAnhio(int aIxAnhio) {
        ixAnhio = aIxAnhio;
    }

    /**
     * Access method for cxDescripcion.
     *
     * @return the current value of cxDescripcion
     */
    public String getCxDescripcion() {
        return cxDescripcion;
    }

    /**
     * Setter method for cxDescripcion.
     *
     * @param aCxDescripcion the new value for cxDescripcion
     */
    public void setCxDescripcion(String aCxDescripcion) {
        cxDescripcion = aCxDescripcion;
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
     * Compares the key for this instance with another SerieMeta.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class SerieMeta and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof SerieMeta)) {
            return false;
        }
        SerieMeta that = (SerieMeta) other;
        if (this.getIdSerie() != that.getIdSerie()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another SerieMeta.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof SerieMeta)) return false;
        return this.equalKeys(other) && ((SerieMeta)other).equalKeys(this);
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
        i = getIdSerie();
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
        StringBuffer sb = new StringBuffer("[SerieMeta |");
        sb.append(" idSerie=").append(getIdSerie());
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
        ret.put("idSerie", Integer.valueOf(getIdSerie()));
        return ret;
    }

}
