// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.catalogos.entidades;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;

@Entity(name="bit_registro")
public class BitacoraRegistro implements Serializable {

    /** Primary key. */
    protected static final String PK = "idRegistro";

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
    @Column(name="id_registro", unique=true, nullable=false, precision=10)
    private int idRegistro;
    @Column(name="df_registro", nullable=false)
    private LocalDateTime dfRegistro;
    @Column(name="cd_tabla_alterada", nullable=false, length=45)
    private String cdTablaAlterada;
    @Column(name="cd_campos_alterados", nullable=false, length=2000)
    private String cdCamposAlterados;
    @Column(name="cx_valoranteriorB64", nullable=false, length=4000)
    private String cxValoranteriorB64;
    @Column(name="cx_valornuevoB64", nullable=false, length=4000)
    private String cxValornuevoB64;
    @ManyToOne(optional=false)
    @JoinColumn(name="cve_usuario", nullable=false)
    private Usuario usuario;

    /** Default constructor. */
    public BitacoraRegistro() {
        super();
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
     * Access method for dfFechahoraEvento.
     *
     * @return the current value of dfFechahoraEvento
     */
    public LocalDateTime getDfRegistro() {
        return dfRegistro;
    }

    /**
     * Setter method for dfFechahoraEvento.
     *
     * @param aDfFechahoraEvento the new value for dfFechahoraEvento
     */
    public void setDfRegistro(LocalDateTime aDfFechahoraEvento) {
        dfRegistro = aDfFechahoraEvento;
    }

    /**
     * Access method for cdTablaAlterada.
     *
     * @return the current value of cdTablaAlterada
     */
    public String getCdTablaAlterada() {
        return cdTablaAlterada;
    }

    /**
     * Setter method for cdTablaAlterada.
     *
     * @param aCdTablaAlterada the new value for cdTablaAlterada
     */
    public void setCdTablaAlterada(String aCdTablaAlterada) {
        cdTablaAlterada = aCdTablaAlterada;
    }

    /**
     * Access method for cdCamposAlterados.
     *
     * @return the current value of cdCamposAlterados
     */
    public String getCdCamposAlterados() {
        return cdCamposAlterados;
    }

    /**
     * Setter method for cdCamposAlterados.
     *
     * @param aCdCamposAlterados the new value for cdCamposAlterados
     */
    public void setCdCamposAlterados(String aCdCamposAlterados) {
        cdCamposAlterados = aCdCamposAlterados;
    }

    /**
     * Access method for cxValoranteriorB64.
     *
     * @return the current value of cxValoranteriorB64
     */
    public String getCxValoranteriorB64() {
        return cxValoranteriorB64;
    }

    /**
     * Setter method for cxValoranteriorB64.
     *
     * @param aCxValoranteriorB64 the new value for cxValoranteriorB64
     */
    public void setCxValoranteriorB64(String aCxValoranteriorB64) {
        cxValoranteriorB64 = aCxValoranteriorB64;
    }

    /**
     * Access method for cxValornuevoB64.
     *
     * @return the current value of cxValornuevoB64
     */
    public String getCxValornuevoB64() {
        return cxValornuevoB64;
    }

    /**
     * Setter method for cxValornuevoB64.
     *
     * @param aCxValornuevoB64 the new value for cxValornuevoB64
     */
    public void setCxValornuevoB64(String aCxValornuevoB64) {
        cxValornuevoB64 = aCxValornuevoB64;
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
     * Compares the key for this instance with another BitacoraRegistro.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class BitacoraRegistro and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof BitacoraRegistro)) {
            return false;
        }
        BitacoraRegistro that = (BitacoraRegistro) other;
        if (this.getIdRegistro() != that.getIdRegistro()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another BitacoraRegistro.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof BitacoraRegistro)) return false;
        return this.equalKeys(other) && ((BitacoraRegistro)other).equalKeys(this);
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
        i = getIdRegistro();
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
        StringBuffer sb = new StringBuffer("[BitacoraRegistro |");
        sb.append(" idRegistro=").append(getIdRegistro());
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
        ret.put("idRegistro", Integer.valueOf(getIdRegistro()));
        return ret;
    }

}
