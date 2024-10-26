// Generated with g9.

package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.AnhoPlaneacion;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity(name="met_mp_estructura")
public class Estructura implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = -4953104552353466851L;

	/** Primary key. */
    protected static final String PK = "idEstructura";

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
    @Column(name="id_estructura", unique=true, nullable=false, precision=10)
    private Integer idEstructura;
    @Column(name="df_registro")
    private LocalDate dfRegistro;
    @Column(name="dh_registro")
    private LocalTime dhRegistro;
    @Column(name="cd_nombre_programa", length=120)
    private String cdNombrePrograma;
    @Column(name="cd_analisis_estado", length=500)
    private String cdAnalisisEstado;
    @Column(name="cd_problemas_publicos", length=500)
    private String cdProblemasPublicos;
    @Column(name="cs_esatus", length=1)
    private String csEstatus;
    @Column(name = "id_validacion", nullable = true)
    private Integer idValidacion;

    @Column(name = "id_validacion_planeacion", nullable = true)
    private Integer idValidacionPlaneacion;

    @Column(name = "id_validacion_supervisor", nullable = true)
    private Integer idValidacionSupervisor;
    @ManyToOne
    @JoinColumn(name="id_catalogo_alineacion")
    private MasterCatalogo alineacion;
    @ManyToOne(optional=false)
    @JoinColumn(name="cve_usuario", nullable=false)
    private Usuario usuario;
    @OneToMany(mappedBy="estructura")
    private List<Meta> meta;
    @OneToMany(mappedBy="estructura")
    private List<Epilogo> epilogo;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_anhio", nullable=false)
    private AnhoPlaneacion anhoPlaneacion;

}
