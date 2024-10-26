// Generated with g9.

package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

@Entity(name="met_mp_linea_base")
public class LineaBase implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** Primary key. */
    protected static final String PK = "idLinea";

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
    @Column(name="id_linea", unique=true, nullable=false, precision=10)
    private int idLinea;
    @Column(name="cx_valor", length=45)
    private String cxValor;
    @Column(name="ix_anhio", precision=10)
    private int ixAnhio;
    @Column(name="cx_notas", length=120)
    private String cxNotas;
    @Column(name="cx_meta", length=500)
    private String cxMeta;
    @Column(name="cx_notas_meta", length=500)
    private String cxNotasMeta;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_meta", nullable=false)
    private Meta meta;

    /** Default constructor. */
    public LineaBase() {
        super();
    }

    /**
     * Access method for idLinea.
     *
     * @return the current value of idLinea
     */
    public int getIdLinea() {
        return idLinea;
    }

    /**
     * Setter method for idLinea.
     *
     * @param aIdLinea the new value for idLinea
     */
    public void setIdLinea(int aIdLinea) {
        idLinea = aIdLinea;
    }

    /**
     * Access method for cxValor.
     *
     * @return the current value of cxValor
     */
    public String getCxValor() {
        return cxValor;
    }

    /**
     * Setter method for cxValor.
     *
     * @param aCxValor the new value for cxValor
     */
    public void setCxValor(String aCxValor) {
        cxValor = aCxValor;
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
     * Access method for cxNotas.
     *
     * @return the current value of cxNotas
     */
    public String getCxNotas() {
        return cxNotas;
    }

    /**
     * Setter method for cxNotas.
     *
     * @param aCxNotas the new value for cxNotas
     */
    public void setCxNotas(String aCxNotas) {
        cxNotas = aCxNotas;
    }

    public String getCxNotasMeta() {
        return cxNotasMeta;
    }

    public void setCxNotasMeta(String cxNotasMeta) {
        this.cxNotasMeta = cxNotasMeta;
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
     * Compares the key for this instance with another LineaBase.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class LineaBase and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof LineaBase)) {
            return false;
        }
        LineaBase that = (LineaBase) other;
        if (this.getIdLinea() != that.getIdLinea()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another LineaBase.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof LineaBase)) return false;
        return this.equalKeys(other) && ((LineaBase)other).equalKeys(this);
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
        i = getIdLinea();
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
        StringBuffer sb = new StringBuffer("[LineaBase |");
        sb.append(" idLinea=").append(getIdLinea());
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
        ret.put("idLinea", Integer.valueOf(getIdLinea()));
        return ret;
    }

}
