// Generated with g9.

package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Entity(name="seg_persona")
public class Persona implements Serializable {

    /** Primary key. */
    protected static final String PK = "idPersona";

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_persona", unique=true, nullable=false, precision=10)
    private int idPersona;
    @Column(name="cx_nombre", nullable=true, length=120)
    private String cxNombre;
    @Column(name="cx_primer_apellido", nullable=true, length=120)
    private String cxPrimerApellido;
    @Column(name="cx_segundo_apellido",nullable=true, length=120)
    private String cxSegundoApellido;
    @Column(name="df_fecha_nacimiento", nullable=true)
    private LocalDate dfFechaNacimiento;
    @Column(name="cx_correo", nullable=true, length=120)
    private String cxCorreo;
    @Column(name="cx_nombre_completo", nullable=true, length=120)
    private String cxNombreCompleto;
    @OneToMany(mappedBy="persona")
    private Set<UsuarioPersona> usuarioPersona;

    
    
    public String getCxNombreCompleto() {
		return cxNombreCompleto;
	}

	public void setCxNombreCompleto(String cxNombreCompleto) {
		this.cxNombreCompleto = cxNombreCompleto;
	}

	/** Default constructor. */
    public Persona() {
        super();
    }

    /**
     * Access method for idPersona.
     *
     * @return the current value of idPersona
     */
    public int getIdPersona() {
        return idPersona;
    }

    /**
     * Setter method for idPersona.
     *
     * @param aIdPersona the new value for idPersona
     */
    public void setIdPersona(int aIdPersona) {
        idPersona = aIdPersona;
    }

    /**
     * Access method for cxNombre.
     *
     * @return the current value of cxNombre
     */
    public String getCxNombre() {
        return cxNombre;
    }

    /**
     * Setter method for cxNombre.
     *
     * @param aCxNombre the new value for cxNombre
     */
    public void setCxNombre(String aCxNombre) {
        cxNombre = aCxNombre;
    }

    /**
     * Access method for cxPrimerApellido.
     *
     * @return the current value of cxPrimerApellido
     */
    public String getCxPrimerApellido() {
        return cxPrimerApellido;
    }

    /**
     * Setter method for cxPrimerApellido.
     *
     * @param aCxPrimerApellido the new value for cxPrimerApellido
     */
    public void setCxPrimerApellido(String aCxPrimerApellido) {
        cxPrimerApellido = aCxPrimerApellido;
    }

    /**
     * Access method for cxSegundoApellido.
     *
     * @return the current value of cxSegundoApellido
     */
    public String getCxSegundoApellido() {
        return cxSegundoApellido;
    }

    /**
     * Setter method for cxSegundoApellido.
     *
     * @param aCxSegundoApellido the new value for cxSegundoApellido
     */
    public void setCxSegundoApellido(String aCxSegundoApellido) {
        cxSegundoApellido = aCxSegundoApellido;
    }

    /**
     * Access method for dfFechaNacimiento.
     *
     * @return the current value of dfFechaNacimiento
     */
    public LocalDate getDfFechaNacimiento() {
        return dfFechaNacimiento;
    }

    /**
     * Setter method for dfFechaNacimiento.
     *
     * @param aDfFechaNacimiento the new value for dfFechaNacimiento
     */
    public void setDfFechaNacimiento(LocalDate aDfFechaNacimiento) {
        dfFechaNacimiento = aDfFechaNacimiento;
    }

    /**
     * Access method for cxCorreo.
     *
     * @return the current value of cxCorreo
     */
    public String getCxCorreo() {
        return cxCorreo;
    }

    /**
     * Setter method for cxCorreo.
     *
     * @param aCxCorreo the new value for cxCorreo
     */
    public void setCxCorreo(String aCxCorreo) {
        cxCorreo = aCxCorreo;
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
     * Compares the key for this instance with another Persona.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class Persona and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof Persona)) {
            return false;
        }
        Persona that = (Persona) other;
        if (this.getIdPersona() != that.getIdPersona()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another Persona.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Persona)) return false;
        return this.equalKeys(other) && ((Persona)other).equalKeys(this);
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
        i = getIdPersona();
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
        StringBuffer sb = new StringBuffer("[Persona |");
        sb.append(" idPersona=").append(getIdPersona());
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
        ret.put("idPersona", Integer.valueOf(getIdPersona()));
        return ret;
    }

}
