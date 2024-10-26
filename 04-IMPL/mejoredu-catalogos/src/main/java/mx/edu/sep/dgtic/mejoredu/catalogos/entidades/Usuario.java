// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.catalogos.entidades;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Version;

@Entity(name="seg_usuario")
public class Usuario implements Serializable {

    /** Primary key. */
    protected static final String PK = "cveUsuario";

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
    @Column(name="cve_usuario", unique=true, nullable=false, length=45)
    private String cveUsuario;
    @Column(name="cs_estatus", nullable=false, length=1)
    private String csEstatus;
    @Column(name="df_baja", nullable=false)
    private LocalDate dfBaja;
    @OneToMany(mappedBy="usuario")
    private Set<BitacoraRegistro> bitacoraRegistro;
    @OneToMany(mappedBy="usuario")
    private Set<UsuarioPersona> usuarioPersona;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_tipo_usuario", nullable=false)
    private TipoUsuario tipoUsuario;

    /** Default constructor. */
    public Usuario() {
        super();
    }

    /**
     * Access method for cveUsuario.
     *
     * @return the current value of cveUsuario
     */
    public String getCveUsuario() {
        return cveUsuario;
    }

    /**
     * Setter method for cveUsuario.
     *
     * @param aCveUsuario the new value for cveUsuario
     */
    public void setCveUsuario(String aCveUsuario) {
        cveUsuario = aCveUsuario;
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
     * Access method for dfBaja.
     *
     * @return the current value of dfBaja
     */
    public LocalDate getDfBaja() {
        return dfBaja;
    }

    /**
     * Setter method for dfBaja.
     *
     * @param aDfBaja the new value for dfBaja
     */
    public void setDfBaja(LocalDate aDfBaja) {
        dfBaja = aDfBaja;
    }

    /**
     * Access method for bitacoraRegistro.
     *
     * @return the current value of bitacoraRegistro
     */
    public Set<BitacoraRegistro> getBitacoraRegistro() {
        return bitacoraRegistro;
    }

    /**
     * Setter method for bitacoraRegistro.
     *
     * @param aBitacoraRegistro the new value for bitacoraRegistro
     */
    public void setBitacoraRegistro(Set<BitacoraRegistro> aBitacoraRegistro) {
        bitacoraRegistro = aBitacoraRegistro;
    }

    /**
     * Access method for usuarioPersona.
     *
     * @return the current value of usuarioPersona
     */
    public Set<UsuarioPersona> getUsuarioPersona() {
        return usuarioPersona;
    }

    /**
     * Setter method for usuarioPersona.
     *
     * @param aUsuarioPersona the new value for usuarioPersona
     */
    public void setUsuarioPersona(Set<UsuarioPersona> aUsuarioPersona) {
        usuarioPersona = aUsuarioPersona;
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
     * Compares the key for this instance with another UsuarioVO.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class UsuarioVO and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof Usuario)) {
            return false;
        }
        Usuario that = (Usuario) other;
        Object myCveUsuario = this.getCveUsuario();
        Object yourCveUsuario = that.getCveUsuario();
        if (myCveUsuario==null ? yourCveUsuario!=null : !myCveUsuario.equals(yourCveUsuario)) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another UsuarioVO.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Usuario)) return false;
        return this.equalKeys(other) && ((Usuario)other).equalKeys(this);
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
        if (getCveUsuario() == null) {
            i = 0;
        } else {
            i = getCveUsuario().hashCode();
        }
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
        StringBuffer sb = new StringBuffer("[UsuarioVO |");
        sb.append(" cveUsuario=").append(getCveUsuario());
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
        ret.put("cveUsuario", getCveUsuario());
        return ret;
    }

}
