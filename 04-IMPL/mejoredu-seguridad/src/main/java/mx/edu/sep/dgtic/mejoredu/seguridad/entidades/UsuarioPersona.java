// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity(name="seg_usuario_persona")
public class UsuarioPersona implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 2978052659840176501L;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_usuario_persona", unique=true, nullable=false, precision=10)
    private int idUsuarioPersona;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_persona", nullable=false)
    private Persona persona;
    @ManyToOne(optional=false)
    @JoinColumn(name="cve_usuario", nullable=false)
    private Usuario usuario;


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
