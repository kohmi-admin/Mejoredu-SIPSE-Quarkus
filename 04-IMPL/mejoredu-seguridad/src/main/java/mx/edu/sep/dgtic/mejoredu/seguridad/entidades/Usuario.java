// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity(name="seg_usuario")
public class    Usuario implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 8073056722487438097L;

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
    @Column(name="cs_estatus", nullable=false, length = 1)
    private String csEstatus;
    @Column(name="df_baja", nullable=true)
    private LocalDate dfBaja;
    @OneToMany(mappedBy="usuario")
    private Set<BitacoraRegistro> bitacoraRegistro;
    @OneToMany(mappedBy="usuario")
    private List<Contrasenhia> contrasenhia;
    @OneToMany(mappedBy="usuario")
    private List<UsuarioPersona> usuarioPersona;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_tipo_usuario", nullable=false)
    private TipoUsuario tipoUsuario;


    @OneToMany(mappedBy="usuario")
    private List<PerfilLaboral> perfilLaboral;

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
