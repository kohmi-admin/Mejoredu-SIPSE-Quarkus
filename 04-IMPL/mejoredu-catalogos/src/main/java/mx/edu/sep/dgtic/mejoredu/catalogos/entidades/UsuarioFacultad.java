// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.catalogos.entidades;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;

@Entity(name="seg_usuario_facultad")
@IdClass(UsuarioFacultad.UsuarioFacultadId.class)
public class UsuarioFacultad implements Serializable {

    /**
     * IdClass for primary key when using JPA annotations
     */
    public class UsuarioFacultadId implements Serializable {
        int idUsuFac;
    }

    /** Primary key. */
    protected static final String PK = "UsuarioFacultadPrimary";

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
    @Column(name="id_usu_fac", unique=true, nullable=false, precision=10)
    private int idUsuFac;
    @Column(name="id_registro", nullable=false, precision=10)
    private int idRegistro;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_facultad", nullable=false)
    private Facultad facultad;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_tipo_usuario", nullable=false)
    private TipoUsuario tipoUsuario;

    /** Default constructor. */
    public UsuarioFacultad() {
        super();
    }

    /**
     * Access method for idUsuFac.
     *
     * @return the current value of idUsuFac
     */
    public int getIdUsuFac() {
        return idUsuFac;
    }

    /**
     * Setter method for idUsuFac.
     *
     * @param aIdUsuFac the new value for idUsuFac
     */
    public void setIdUsuFac(int aIdUsuFac) {
        idUsuFac = aIdUsuFac;
    }

    /**
     * Access method for idRegistro.
     *
     * @return the current value of idRegistro
     */
    public int getIdRegistro() {
        return idRegistro;
    }

    /**
     * Setter method for idRegistro.
     *
     * @param aIdRegistro the new value for idRegistro
     */
    public void setIdRegistro(int aIdRegistro) {
        idRegistro = aIdRegistro;
    }

    /**
     * Access method for facultad.
     *
     * @return the current value of facultad
     */
    public Facultad getFacultad() {
        return facultad;
    }

    /**
     * Setter method for facultad.
     *
     * @param aFacultad the new value for facultad
     */
    public void setFacultad(Facultad aFacultad) {
        facultad = aFacultad;
    }

    /**
     * Access method for tipoUsuario.
     *
     * @return the current value of tipoUsuario
     */
    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    /**
     * Setter method for tipoUsuario.
     *
     * @param aTipoUsuario the new value for tipoUsuario
     */
    public void setTipoUsuario(TipoUsuario aTipoUsuario) {
        tipoUsuario = aTipoUsuario;
    }

    /**
     * Compares the key for this instance with another UsuarioFacultad.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class UsuarioFacultad and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof UsuarioFacultad)) {
            return false;
        }
        UsuarioFacultad that = (UsuarioFacultad) other;
        if (this.getIdUsuFac() != that.getIdUsuFac()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another UsuarioFacultad.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof UsuarioFacultad)) return false;
        return this.equalKeys(other) && ((UsuarioFacultad)other).equalKeys(this);
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
        i = getIdUsuFac();
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
        StringBuffer sb = new StringBuffer("[UsuarioFacultad |");
        sb.append(" idUsuFac=").append(getIdUsuFac());
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
        ret.put("idUsuFac", Integer.valueOf(getIdUsuFac()));
        return ret;
    }

}
