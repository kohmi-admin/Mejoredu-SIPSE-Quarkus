// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Version;

@Entity(name="seg_facultad")
public class Facultad implements Serializable {

    /** Primary key. */
    protected static final String PK = "idFacultad";

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
    @Column(name="id_facultad", unique=true, nullable=false, precision=10)
    private int idFacultad;
    @Column(name="cd_facultad", length=45)
    private String cdFacultad;
    @Column(name="cs_status", length = 1)
    private String csStatus;
    @OneToMany(mappedBy="facultad")
    private Set<UsuarioFacultad> usuarioFacultad;

    /** Default constructor. */
    public Facultad() {
        super();
    }

    /**
     * Access method for idFacultad.
     *
     * @return the current value of idFacultad
     */
    public int getIdFacultad() {
        return idFacultad;
    }

    /**
     * Setter method for idFacultad.
     *
     * @param aIdFacultad the new value for idFacultad
     */
    public void setIdFacultad(int aIdFacultad) {
        idFacultad = aIdFacultad;
    }

    /**
     * Access method for cdFacultad.
     *
     * @return the current value of cdFacultad
     */
    public String getCdFacultad() {
        return cdFacultad;
    }

    /**
     * Setter method for cdFacultad.
     *
     * @param aCdFacultad the new value for cdFacultad
     */
    public void setCdFacultad(String aCdFacultad) {
        cdFacultad = aCdFacultad;
    }

    /**
     * Access method for csStatus.
     *
     * @return the current value of csStatus
     */
    public String getCsStatus() {
        return csStatus;
    }

    /**
     * Setter method for csStatus.
     *
     * @param aCsStatus the new value for csStatus
     */
    public void setCsStatus(String aCsStatus) {
        csStatus = aCsStatus;
    }

    /**
     * Access method for usuarioFacultad.
     *
     * @return the current value of usuarioFacultad
     */
    public Set<UsuarioFacultad> getUsuarioFacultad() {
        return usuarioFacultad;
    }

    /**
     * Setter method for usuarioFacultad.
     *
     * @param aUsuarioFacultad the new value for usuarioFacultad
     */
    public void setUsuarioFacultad(Set<UsuarioFacultad> aUsuarioFacultad) {
        usuarioFacultad = aUsuarioFacultad;
    }

    /**
     * Compares the key for this instance with another Facultad.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class Facultad and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof Facultad)) {
            return false;
        }
        Facultad that = (Facultad) other;
        if (this.getIdFacultad() != that.getIdFacultad()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another Facultad.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Facultad)) return false;
        return this.equalKeys(other) && ((Facultad)other).equalKeys(this);
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
        i = getIdFacultad();
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
        StringBuffer sb = new StringBuffer("[Facultad |");
        sb.append(" idFacultad=").append(getIdFacultad());
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
        ret.put("idFacultad", Integer.valueOf(getIdFacultad()));
        return ret;
    }

}
