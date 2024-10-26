// Generated with g9.

package mx.mejoredu.dgtic.entidades;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;

@Entity(name="seg_usuario_persona")
public class UsuarioPersona implements Serializable {

    /** Primary key. */
    protected static final String PK = "idUsuarioPersona";

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

    @Column(name="cs_estatus", nullable=false, length=1)
    private String csEstatus;
    @Id
    @Column(name="id_usuario_persona", unique=true, nullable=false, precision=10)
    private int idUsuarioPersona;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_persona", nullable=false)
    private Persona persona;
    @ManyToOne(optional=false)
    @JoinColumn(name="cve_usuario", nullable=false)
    private Usuario usuario;

    
    /** Default constructor. */
    public UsuarioPersona() {
        super();
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
     * Access method for idUsuarioPersona.
     *
     * @return the current value of idUsuarioPersona
     */
    public int getIdUsuarioPersona() {
        return idUsuarioPersona;
    }

    /**
     * Setter method for idUsuarioPersona.
     *
     * @param aIdUsuarioPersona the new value for idUsuarioPersona
     */
    public void setIdUsuarioPersona(int aIdUsuarioPersona) {
        idUsuarioPersona = aIdUsuarioPersona;
    }

    /**
     * Access method for persona.
     *
     * @return the current value of persona
     */
    public Persona getPersona() {
        return persona;
    }

    /**
     * Setter method for persona.
     *
     * @param aPersona the new value for persona
     */
    public void setPersona(Persona aPersona) {
        persona = aPersona;
    }

    /**
     * Access method for usuario.
     *
     * @return the current value of usuario
     */
    public Usuario getUsuario() {
        return usuario;
    }

    /**
     * Setter method for usuario.
     *
     * @param aUsuario the new value for usuario
     */
    public void setUsuario(Usuario aUsuario) {
        usuario = aUsuario;
    }
    
   

	/**
     * Compares the key for this instance with another UsuarioPersona.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class UsuarioPersona and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof UsuarioPersona)) {
            return false;
        }
        UsuarioPersona that = (UsuarioPersona) other;
        if (this.getIdUsuarioPersona() != that.getIdUsuarioPersona()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another UsuarioPersona.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof UsuarioPersona)) return false;
        return this.equalKeys(other) && ((UsuarioPersona)other).equalKeys(this);
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
        i = getIdUsuarioPersona();
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
        StringBuffer sb = new StringBuffer("[UsuarioPersona |");
        sb.append(" idUsuarioPersona=").append(getIdUsuarioPersona());
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
        ret.put("idUsuarioPersona", Integer.valueOf(getIdUsuarioPersona()));
        return ret;
    }

}
