// Generated with g9.

package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.*;

@Entity(name="met_estrategia_accion")
public class EstrategiaAccion implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = -3526046969038633802L;

	/** Primary key. */
    protected static final String PK = "idEstaci";

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
    @Column(name="id_estaci", unique=true, nullable=false, precision=10)
    private Integer idEstaci;
    @Column(name="ix_tipo", precision=10)
    private Integer ixTipo;
    @ManyToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name="id_catalogo", nullable=false)
    private MasterCatalogo masterCatalogo;
    @ManyToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name="id_actividad", nullable=false)
    private Actividad actividad;

    /** Default constructor. */
    public EstrategiaAccion() {
        super();
    }

    /**
     * Access method for idEstaci.
     *
     * @return the current value of idEstaci
     */
    public Integer getIdEstaci() {
        return idEstaci;
    }

    /**
     * Setter method for idEstaci.
     *
     * @param aIdEstaci the new value for idEstaci
     */
    public void setIdEstaci(Integer aIdEstaci) {
        idEstaci = aIdEstaci;
    }

    /**
     * Access method for ixTipo.
     *
     * @return the current value of ixTipo
     */
    public Integer getIxTipo() {
        return ixTipo;
    }

    /**
     * Setter method for ixTipo.
     *
     * @param aIxTipo the new value for ixTipo
     */
    public void setIxTipo(Integer aIxTipo) {
        ixTipo = aIxTipo;
    }

    /**
     * Access method for masterCatalogo.
     *
     * @return the current value of masterCatalogo
     */
    public MasterCatalogo getMasterCatalogo() {
        return masterCatalogo;
    }

    /**
     * Setter method for masterCatalogo.
     *
     * @param aMasterCatalogo the new value for masterCatalogo
     */
    public void setMasterCatalogo(MasterCatalogo aMasterCatalogo) {
        masterCatalogo = aMasterCatalogo;
    }

    /**
     * Access method for actividad.
     *
     * @return the current value of actividad
     */
    public Actividad getActividad() {
        return actividad;
    }

    /**
     * Setter method for actividad.
     *
     * @param aActividad the new value for actividad
     */
    public void setActividad(Actividad aActividad) {
        actividad = aActividad;
    }

    /**
     * Compares the key for this instance with another EstrategiaAccion.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class EstrategiaAccion and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof EstrategiaAccion)) {
            return false;
        }
        EstrategiaAccion that = (EstrategiaAccion) other;
        if (this.getIdEstaci() != that.getIdEstaci()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another EstrategiaAccion.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof EstrategiaAccion)) return false;
        return this.equalKeys(other) && ((EstrategiaAccion)other).equalKeys(this);
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
        i = getIdEstaci();
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
        StringBuffer sb = new StringBuffer("[EstrategiaAccion |");
        sb.append(" idEstaci=").append(getIdEstaci());
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
        ret.put("idEstaci", Integer.valueOf(getIdEstaci()));
        return ret;
    }

}
