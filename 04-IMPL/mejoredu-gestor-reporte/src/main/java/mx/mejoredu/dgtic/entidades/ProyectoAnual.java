package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity(name = "met_cortoplazo_proyecto")
public class ProyectoAnual {

    /** Primary key. */
    protected static final String PK = "idProyecto";

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

    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_proyecto", unique=true, nullable=false, precision=10)
    private Integer idProyecto;
    @Column(name="cve_proyecto", nullable=false, precision=10)
    private int cveProyecto;
    @Column(name="cx_nombre_proyecto", nullable=false, length=90)
    private String cxNombreProyecto;
    @Column(name="cx_objetivo", nullable=false, length=100)
    private String cxObjetivo;
    @Column(name="cx_objetivo_prioritario", nullable=true, length=300)
    private String cxObjetivoPrioritario;
    @Column(name="df_proyecto")
    private LocalDate dfProyecto;
    @Column(name="dh_proyecto")
    private LocalTime dhProyecto;
    @Column(name="cs_estatus", length=1)
    private String csEstatus;
    @Column(name="cx_nombre_unidad", length=90)
    private String cxNombreUnidad;
    @Column(name="cve_unidad", length=45)
    private String cveUnidad;
    @Column(name="cx_alcance", length=200)
    private String cxAlcance;
    @Column(name="cx_fundamentacion", length=200)
    private String cxFundamentacion;
    @Column(name="ix_fuente_registro", length=1)
    private Integer ix_fuente_registro;
    @OneToMany(mappedBy="proyectoAnual")
    private List<ProyectoContribucion> proyectoContribucion = new ArrayList<>();
    @ManyToOne(optional=false)
    @JoinColumn(name="id_anhio", nullable=true)
    private AnhoPlaneacion anhoPlaneacion;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_archivo", nullable=true)
    private Archivo archivo;
    @ManyToOne(optional=false)
    @JoinColumn(name="cve_usuario", nullable=true)
    private Usuario usuario;
    @Column(name="df_actualizacion", length=45)
    private LocalDate dfactualizacion;
    @Column(name="dh_actualizacion", length=45)
    private LocalTime dhActualizacion;
    @Column(name="cve_usuario_actualiza", length=45)
    private String cveUsuarioActualiza;
    @Column(name = "id_validacion", nullable = true)
    private Integer idValidacion;

    @Column(name = "id_validacion_planeacion", nullable = true)
    private Integer idValidacionPlaneacion;

    @Column(name = "id_validacion_supervisor", nullable = true)
    private Integer idValidacionSupervisor;

    @ManyToOne
	@JoinColumn(name = "id_catalogo_unidad")
	private CatMasterCatalogo unidadAdministrativa;

    @Column(name = "it_semantica", nullable = true)
    private Integer ixSemantica;
    
    
	public Integer getIxSemantica() {
		return ixSemantica;
	}

	public void setIxSemantica(Integer ixSemantica) {
		this.ixSemantica = ixSemantica;
	}

	public CatMasterCatalogo getUnidadAdministrativa() {
		return unidadAdministrativa;
	}

	public void setUnidadAdministrativa(CatMasterCatalogo unidadAdministrativa) {
		this.unidadAdministrativa = unidadAdministrativa;
	}

	public Integer getIx_fuente_registro() {
		return ix_fuente_registro;
	}

	public Integer getIdValidacion() {
        return idValidacion;
    }
    public void setIdValidacion(Integer idValidacion) {
        this.idValidacion = idValidacion;
    }

    public Integer getIdValidacionPlaneacion() {
        return idValidacionPlaneacion;
    }

    public void setIdValidacionPlaneacion(Integer idValidacionPlaneacion) {
        this.idValidacionPlaneacion = idValidacionPlaneacion;
    }

    public Integer getIdValidacionSupervisor() {
        return idValidacionSupervisor;
    }

    public void setIdValidacionSupervisor(Integer idValidacionSupervisor) {
        this.idValidacionSupervisor = idValidacionSupervisor;
    }

    /** Default constructor. */
    public ProyectoAnual() {
        super();
    }


	public void setIx_fuente_registro(Integer ix_fuente_registro) {
		this.ix_fuente_registro = ix_fuente_registro;
	}

	public String getCveUnidad() {
        return cveUnidad;
    }

    public void setCveUnidad(String pCveUnidad) {
        cveUnidad = pCveUnidad;
    }

    /**
     * Access method for idProyecto.
     *
     * @return the current value of idProyecto
     */
    public Integer getIdProyecto() {
        return idProyecto;
    }

    /**
     * Setter method for idProyecto.
     *
     * @param aIdProyecto the new value for idProyecto
     */
    public void setIdProyecto(Integer aIdProyecto) {
        idProyecto = aIdProyecto;
    }

    /**
     * Access method for cveProyecto.
     *
     * @return the current value of cveProyecto
     */
    public int getCveProyecto() {
        return cveProyecto;
    }

    /**
     * Setter method for cveProyecto.
     *
     * @param aCveProyecto the new value for cveProyecto
     */
    public void setCveProyecto(int aCveProyecto) {
        cveProyecto = aCveProyecto;
    }

    /**
     * Access method for cxNombreProyecto.
     *
     * @return the current value of cxNombreProyecto
     */
    public String getCxNombreProyecto() {
        return cxNombreProyecto;
    }

    /**
     * Setter method for cxNombreProyecto.
     *
     * @param aCxNombreProyecto the new value for cxNombreProyecto
     */
    public void setCxNombreProyecto(String aCxNombreProyecto) {
        cxNombreProyecto = aCxNombreProyecto;
    }

    /**
     * Access method for cxObjetivo.
     *
     * @return the current value of cxObjetivo
     */
    public String getCxObjetivo() {
        return cxObjetivo;
    }

    /**
     * Setter method for cxObjetivo.
     *
     * @param aCxObjetivo the new value for cxObjetivo
     */
    public void setCxObjetivo(String aCxObjetivo) {
        cxObjetivo = aCxObjetivo;
    }

    /**
     * Access method for cxObjetivoPrioritario.
     *
     * @return the current value of cxObjetivoPrioritario
     */
    public String getCxObjetivoPrioritario() {
        return cxObjetivoPrioritario;
    }

    /**
     * Setter method for cxObjetivoPrioritario.
     *
     * @param aCxObjetivoPrioritario the new value for cxObjetivoPrioritario
     */
    public void setCxObjetivoPrioritario(String aCxObjetivoPrioritario) {
        cxObjetivoPrioritario = aCxObjetivoPrioritario;
    }

    /**
     * Access method for dfProyecto.
     *
     * @return the current value of dfProyecto
     */
    public LocalDate getDfProyecto() {
        return dfProyecto;
    }

    /**
     * Setter method for dfProyecto.
     *
     * @param aDfProyecto the new value for dfProyecto
     */
    public void setDfProyecto(LocalDate aDfProyecto) {
        dfProyecto = aDfProyecto;
    }

    /**
     * Access method for dhProyecto.
     *
     * @return the current value of dhProyecto
     */
    public LocalTime getDhProyecto() {
        return dhProyecto;
    }

    /**
     * Setter method for dhProyecto.
     *
     * @param aDhProyecto the new value for dhProyecto
     */
    public void setDhProyecto(LocalTime aDhProyecto) {
        dhProyecto = aDhProyecto;
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
     * Access method for cxNombreUnidad.
     *
     * @return the current value of cxNombreUnidad
     */
    public String getCxNombreUnidad() {
        return cxNombreUnidad;
    }

    /**
     * Setter method for cxNombreUnidad.
     *
     * @param aCxNombreUnidad the new value for cxNombreUnidad
     */
    public void setCxNombreUnidad(String aCxNombreUnidad) {
        cxNombreUnidad = aCxNombreUnidad;
    }

    /**
     * Access method for cxAlcance.
     *
     * @return the current value of cxAlcance
     */
    public String getCxAlcance() {
        return cxAlcance;
    }

    /**
     * Setter method for cxAlcance.
     *
     * @param aCxAlcance the new value for cxAlcance
     */
    public void setCxAlcance(String aCxAlcance) {
        cxAlcance = aCxAlcance;
    }

    /**
     * Access method for cxFundamentacion.
     *
     * @return the current value of cxFundamentacion
     */
    public String getCxFundamentacion() {
        return cxFundamentacion;
    }

    /**
     * Setter method for cxFundamentacion.
     *
     * @param aCxFundamentacion the new value for cxFundamentacion
     */
    public void setCxFundamentacion(String aCxFundamentacion) {
        cxFundamentacion = aCxFundamentacion;
    }


    /**
     * Access method for proyectoContribucion.
     *
     * @return the current value of proyectoContribucion
     */
    public List<ProyectoContribucion> getProyectoContribucion() {
        return proyectoContribucion;
    }

    /**
     * Setter method for proyectoContribucion.
     *
     * @param aMetProyectoContribucion the new value for proyectoContribucion
     */
    public void setProyectoContribucion(List<ProyectoContribucion> aProyectoContribucion) {
        proyectoContribucion = aProyectoContribucion;
    }

    /**
     * Access method for anhoPlaneacion.
     *
     * @return the current value of anhoPlaneacion
     */
    public AnhoPlaneacion getAnhoPlaneacion() {
        return anhoPlaneacion;
    }

    /**
     * Setter method for anhoPlaneacion.
     *
     * @param aAnhoPlaneacion the new value for anhoPlaneacion
     */
    public void setAnhoPlaneacion(AnhoPlaneacion aAnhoPlaneacion) {
        anhoPlaneacion = aAnhoPlaneacion;
    }

    /**
     * Access method for archivo.
     *
     * @return the current value of archivo
     */
    public Archivo getArchivo() {
        return archivo;
    }

    /**
     * Setter method for archivo.
     *
     * @param aArchivo the new value for archivo
     */
    public void setArchivo(Archivo aArchivo) {
        archivo = aArchivo;
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
    public LocalDate getDfactualizacion() {
        return dfactualizacion;
    }

    public void setDfactualizacion(LocalDate dfactualizacion) {
        this.dfactualizacion = dfactualizacion;
    }

    public LocalTime getDhActualizacion() {
        return dhActualizacion;
    }

    public void setDhActualizacion(LocalTime dhActualizacion) {
        this.dhActualizacion = dhActualizacion;
    }

    public String getCveUsuarioActualiza() {
        return cveUsuarioActualiza;
    }

    public void setCveUsuarioActualiza(String cveUsuarioActualiza) {
        this.cveUsuarioActualiza = cveUsuarioActualiza;
    }

    /**
     * Compares the key for this instance with another CortoplazoProyecto.
     *
     * @param other The object to compare to
     * @return True if other object is instance of class CortoplazoProyecto and the key objects are equal
     */
    private boolean equalKeys(Object other) {
        if (this==other) {
            return true;
        }
        if (!(other instanceof ProyectoAnual)) {
            return false;
        }
        ProyectoAnual that = (ProyectoAnual) other;
        if (this.getIdProyecto() != that.getIdProyecto()) {
            return false;
        }
        return true;
    }

    /**
     * Compares this instance with another CortoplazoProyecto.
     *
     * @param other The object to compare to
     * @return True if the objects are the same
     */
    @Override
    public boolean equals(Object other) {
        if (!(other instanceof ProyectoAnual)) return false;
        return this.equalKeys(other) && ((ProyectoAnual)other).equalKeys(this);
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
        i = getIdProyecto();
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
        StringBuffer sb = new StringBuffer("[CortoplazoProyecto |");
        sb.append(" idProyecto=").append(getIdProyecto());
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
        ret.put("idProyecto", Integer.valueOf(getIdProyecto()));
        return ret;
    }

}
