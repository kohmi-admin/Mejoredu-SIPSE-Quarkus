// Generated with g9.

package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Entity(name="seg_tipo_usuario")
public class TipoUsuario implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** Primary key. */
    protected static final String PK = "idTipoUsuario";

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
    @Column(name="id_tipo_usuario", unique=true, nullable=false, precision=10)
    private int idTipoUsuario;
    @Column(name="cd_tipo_usuario", nullable=false, length=45)
    private String cdTipoUsuario;
    @Column(name="cs_estatus", nullable=false, length=1)
    private String csEstatus;
    @Column(name="id_bitacora", nullable=false, precision=10)
    private int idBitacora;

    @OneToMany(mappedBy="tipoUsuario")
    private Set<Usuario> usuario;

    /** Default constructor. */
    public TipoUsuario() {
        super();
    }

    /**
     * Access method for idTipoUsuario.
     *
     * @return the current value of idTipoUsuario
     */
    public int getIdTipoUsuario() {
        return idTipoUsuario;
    }

    /**
     * Setter method for idTipoUsuario.
     *
     * @param aIdTipoUsuario the new value for idTipoUsuario
     */
    public void setIdTipoUsuario(int aIdTipoUsuario) {
        idTipoUsuario = aIdTipoUsuario;
    }

    /**
     * Access method for cdTipoUsuario.
     *
     * @return the current value of cdTipoUsuario
     */
    public String getCdTipoUsuario() {
        return cdTipoUsuario;
    }

    /**
     * Setter method for cdTipoUsuario.
     *
     * @param aCdTipoUsuario the new value for cdTipoUsuario
     */
    public void setCdTipoUsuario(String aCdTipoUsuario) {
        cdTipoUsuario = aCdTipoUsuario;
    }

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
     * Access method for idBitacora.
     *
     * @return the current value of idBitacora
     */
    public int getIdBitacora() {
        return idBitacora;
    }

    /**
     * Setter method for idBitacora.
     *
     * @param aIdBitacora the new value for idBitacora
     */
    public void setIdBitacora(int aIdBitacora) {
        idBitacora = aIdBitacora;
    }

    /**
     * Access method for usuario.
     *
     * @return the current value of usuario
     */
    public Set<Usuario> getUsuario() {
        return usuario;
    }

    /**
     * Setter method for usuario.
     *
     * @param aUsuario the new value for usuario
     */
    public void setUsuario(Set<Usuario> aUsuario) {
        usuario = aUsuario;
    }

    /**
     * Compares the key for this instance with another TipoUsuario.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class TipoUsuario and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof TipoUsuario)) {
            return false;
        }
        TipoUsuario that = (TipoUsuario) other;
        if (this.getIdTipoUsuario() != that.getIdTipoUsuario()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another TipoUsuario.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof TipoUsuario)) return false;
        return this.equalKeys(other) && ((TipoUsuario)other).equalKeys(this);
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
        i = getIdTipoUsuario();
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
        StringBuffer sb = new StringBuffer("[TipoUsuario |");
        sb.append(" idTipoUsuario=").append(getIdTipoUsuario());
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
        ret.put("idTipoUsuario", Integer.valueOf(getIdTipoUsuario()));
        return ret;
    }

}
