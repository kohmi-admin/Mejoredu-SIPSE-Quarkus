// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;

@Entity(name="seg_contrasenhia")
public class Contrasenhia implements Serializable {

    /** Primary key. */
    protected static final String PK = "idContra";

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

    @Column(name="cx_palabra_secreta", nullable=false, length=120)
    private String cxPalabraSecreta;
    @Column(name="df_fecha", nullable=false)
    private LocalDate dfFecha;
    @Column(name="cs_estatus", nullable=false, length=1)
    private String csEstatus;
    @Column(name="ix_numero_intentos", nullable=false, precision=10)
    private int ixNumeroIntentos;
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_contra", unique=true, nullable=false, precision=10)
    private int idContra;
    @ManyToOne(optional=false)
    @JoinColumn(name="cve_usuario", nullable=false)
    private Usuario usuario;

    /** Default constructor. */
    public Contrasenhia() {
        super();
    }

    /**
     * Access method for cxPalabraSecreta.
     *
     * @return the current value of cxPalabraSecreta
     */
    public String getCxPalabraSecreta() {
        return cxPalabraSecreta;
    }

    /**
     * Setter method for cxPalabraSecreta.
     *
     * @param aCxPalabraSecreta the new value for cxPalabraSecreta
     */
    public void setCxPalabraSecreta(String aCxPalabraSecreta) {
        cxPalabraSecreta = aCxPalabraSecreta;
    }

    /**
     * Access method for dfFecha.
     *
     * @return the current value of dfFecha
     */
    public LocalDate getDfFecha() {
        return dfFecha;
    }

    /**
     * Setter method for dfFecha.
     *
     * @param aDfFecha the new value for dfFecha
     */
    public void setDfFecha(LocalDate aDfFecha) {
        dfFecha = aDfFecha;
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
     * Access method for ixNumeroIntentos.
     *
     * @return the current value of ixNumeroIntentos
     */
    public int getIxNumeroIntentos() {
        return ixNumeroIntentos;
    }

    /**
     * Setter method for ixNumeroIntentos.
     *
     * @param aIxNumeroIntentos the new value for ixNumeroIntentos
     */
    public void setIxNumeroIntentos(int aIxNumeroIntentos) {
        ixNumeroIntentos = aIxNumeroIntentos;
    }

    /**
     * Access method for idContra.
     *
     * @return the current value of idContra
     */
    public int getIdContra() {
        return idContra;
    }

    /**
     * Setter method for idContra.
     *
     * @param aIdContra the new value for idContra
     */
    public void setIdContra(int aIdContra) {
        idContra = aIdContra;
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
     * Compares the key for this instance with another Contrasenhia.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class Contrasenhia and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof Contrasenhia)) {
            return false;
        }
        Contrasenhia that = (Contrasenhia) other;
        if (this.getIdContra() != that.getIdContra()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another Contrasenhia.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Contrasenhia)) return false;
        return this.equalKeys(other) && ((Contrasenhia)other).equalKeys(this);
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
        i = getIdContra();
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
        StringBuffer sb = new StringBuffer("[Contrasenhia |");
        sb.append(" idContra=").append(getIdContra());
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
        ret.put("idContra", Integer.valueOf(getIdContra()));
        return ret;
    }

}
