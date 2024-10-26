// Generated with g9.

package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.*;

@Entity(name="met_proyecto_contribucion")
public class ProyectoContribucion implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = -669395478559139335L;

	/** Primary key. */
    protected static final String PK = "idProycontri";

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
    @Column(name="id_proycontri", unique=true, nullable=false, precision=10)
    private Integer idProycontri;
    @Column(name="ix_tipo_contri", precision=10)
    private Integer ixTipoContri;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_catalogo_contribucion", nullable=false)
    private MasterCatalogo contribucion;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_proyecto", nullable=false)
    private Proyecto proyectoAnual;

    /** Default constructor. */
    public ProyectoContribucion() {
        super();
    }

    /**
     * Access method for idProycontri.
     *
     * @return the current value of idProycontri
     */
    public Integer getIdProycontri() {
        return idProycontri;
    }

    /**
     * Setter method for idProycontri.
     *
     * @param aIdProycontri the new value for idProycontri
     */
    public void setIdProycontri(Integer aIdProycontri) {
        idProycontri = aIdProycontri;
    }

    /**
     * Access method for ixTipoContri.
     *
     * @return the current value of ixTipoContri
     */
    public Integer getIxTipoContri() {
        return ixTipoContri;
    }

    /**
     * Setter method for ixTipoContri.
     *
     * @param aIxTipoContri the new value for ixTipoContri
     */
    public void setIxTipoContri(Integer aIxTipoContri) {
        ixTipoContri = aIxTipoContri;
    }

    /**
     * Access method for proyectoAnual.
     *
     * @return the current value of proyectoAnual
     */
    public Proyecto getProyectoAnual() {
        return proyectoAnual;
    }

    /**
     * Setter method for proyectoAnual.
     *
     * @param aMetCortoplazoProyecto the new value for proyectoAnual
     */
    public void setProyectoAnual(Proyecto aMetCortoplazoProyecto) {
        proyectoAnual = aMetCortoplazoProyecto;
    }
    
    /**
     * Access method for catMasterCatalogo.
     *
     * @return the current value of catMasterCatalogo
     */
    public MasterCatalogo getContribucion() {
        return contribucion;
    }

    /**
     * Setter method for catMasterCatalogo.
     *
     * @param aCatMasterCatalogo the new value for catMasterCatalogo
     */
    public void setContribucion(MasterCatalogo pContribucion) {
    	contribucion = pContribucion;
    }

    /**
     * Compares the key for this instance with another ProyectoContribucion.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class ProyectoContribucion and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof ProyectoContribucion)) {
            return false;
        }
        ProyectoContribucion that = (ProyectoContribucion) other;
        if (this.getIdProycontri() != that.getIdProycontri()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another ProyectoContribucion.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof ProyectoContribucion)) return false;
        return this.equalKeys(other) && ((ProyectoContribucion)other).equalKeys(this);
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
        i = getIdProycontri();
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
        StringBuffer sb = new StringBuffer("[ProyectoContribucion |");
        sb.append(" idProycontri=").append(getIdProycontri());
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
        ret.put("idProycontri", Integer.valueOf(getIdProycontri()));
        return ret;
    }

}
