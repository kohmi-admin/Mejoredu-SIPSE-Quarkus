package mx.sep.dgtic.sipse.medianoplazo.entidades;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;

@Entity(name = "cat_master_catalogo")
public class MasterCatalogo implements Serializable {


	    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

		/** Primary key. */
	    protected static final String PK = "idCatalogo";

	    /**
	     * The optimistic lock. Available via standard bean get/set operations.
	     */
	    @Version
	    @Column(name="LOCK_FLAG", nullable=true)
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
	    @Column(name="id_catalogo", unique=true, nullable=false, precision=10)
	    private Integer idCatalogo;

		@Column(name = "id_validar", nullable = true)
		private Integer idValidacion;

	@Column(name = "id_validacion_planeacion", nullable = true)
	private Integer idValidacionPlaneacion;

	@Column(name = "id_validacion_supervisor", nullable = true)
	private Integer idValidacionSupervisor;
	    @Column(name="cd_opcion", nullable=false, length=500)
	    private String cdOpcion;
	    @Column(name="cc_externa", length=45, nullable = true)
	    private String ccExterna;
	    @Column(name="df_baja", nullable = true)
	    private LocalDate dfBaja;
	    @Column(name="cd_descripcionDos", length=500, nullable = true)
	    private String cdDescripcionDos;
	    @Column(name="cc_externaDos", length=45, nullable = true)
	    private String ccExternaDos;
	    
	    @ManyToOne
	    @JoinColumn(name="id_catalogo_padre")
	    private MasterCatalogo MasterCatalogo2;

	    @Column(name="ix_dependencia", nullable=true, precision=10)
	    private Integer ixDependencia;
	    
		@ManyToOne(fetch = FetchType.LAZY)
		@JoinColumn(name = "cve_usuario")
		private Usuario usuario;



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
	    
	    public Usuario getUsuario() {
			return usuario;
		}

		public void setUsuario(Usuario usuario) {
			this.usuario = usuario;
		}

		public MasterCatalogo getMasterCatalogo2() {
			return MasterCatalogo2;
		}

		public void setMasterCatalogo2(MasterCatalogo masterCatalogo2) {
			MasterCatalogo2 = masterCatalogo2;
		}

	    public Integer getIxDependencia() {
			return ixDependencia;
		}

		public void setIxDependencia(Integer ixDependencia) {
			this.ixDependencia = ixDependencia;
		}


		/** Default constructor. */
	    public MasterCatalogo() {
	        super();
	    }

	    /**
	     * Access method for idCatalogo.
	     *
	     * @return the current value of idCatalogo
	     */
	    public Integer getIdCatalogo() {
	        return idCatalogo;
	    }

	    /**
	     * Setter method for idCatalogo.
	     *
	     * @param aIdCatalogo the new value for idCatalogo
	     */
	    public void setIdCatalogo(Integer aIdCatalogo) {
	        idCatalogo = aIdCatalogo;
	    }

	    /**
	     * Access method for cdOpcion.
	     *
	     * @return the current value of cdOpcion
	     */
	    public String getCdOpcion() {
	        return cdOpcion;
	    }

	    /**
	     * Setter method for cdOpcion.
	     *
	     * @param aCdOpcion the new value for cdOpcion
	     */
	    public void setCdOpcion(String aCdOpcion) {
	        cdOpcion = aCdOpcion;
	    }

	    /**
	     * Access method for ccExterna.
	     *
	     * @return the current value of ccExterna
	     */
	    public String getCcExterna() {
	        return ccExterna;
	    }

	    /**
	     * Setter method for ccExterna.
	     *
	     * @param aCcExterna the new value for ccExterna
	     */
	    public void setCcExterna(String aCcExterna) {
	        ccExterna = aCcExterna;
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
	     * Access method for cdDescripcionDos.
	     *
	     * @return the current value of cdDescripcionDos
	     */
	    public String getCdDescripcionDos() {
	        return cdDescripcionDos;
	    }

	    /**
	     * Setter method for cdDescripcionDos.
	     *
	     * @param aCdDescripcionDos the new value for cdDescripcionDos
	     */
	    public void setCdDescripcionDos(String aCdDescripcionDos) {
	        cdDescripcionDos = aCdDescripcionDos;
	    }

	    /**
	     * Access method for ccExternaDos.
	     *
	     * @return the current value of ccExternaDos
	     */
	    public String getCcExternaDos() {
	        return ccExternaDos;
	    }

	    /**
	     * Setter method for ccExternaDos.
	     *
	     * @param aCcExternaDos the new value for ccExternaDos
	     */
	    public void setCcExternaDos(String aCcExternaDos) {
	        ccExternaDos = aCcExternaDos;
	    }

	    /**
	     * Access method for MasterCatalogo3.
	     *
	     * @return the current value of MasterCatalogo3
	     */
//	    public Set<MasterCatalogo> getMasterCatalogo3() {
//	        return MasterCatalogo3;
//	    }

	    /**
	     * Setter method for MasterCatalogo3.
	     *
	     * @param aMasterCatalogo3 the new value for MasterCatalogo3
	     */
//	    public void setMasterCatalogo3(Set<MasterCatalogo> aMasterCatalogo3) {
//	        MasterCatalogo3 = aMasterCatalogo3;
//	    }

	    /**
	     * Compares the key for this instance with another MasterCatalogo.
	     *
	     * @param other The object to compare to
	     * @return True if other object is instance of class MasterCatalogo and the key objects are equal
	     */
	    private boolean equalKeys(Object other) {
	        if (this==other) {
	            return true;
	        }
	        if (!(other instanceof MasterCatalogo)) {
	            return false;
	        }
	        MasterCatalogo that = (MasterCatalogo) other;
	        if (this.getIdCatalogo() != that.getIdCatalogo()) {
	            return false;
	        }
	        return true;
	    }

	    /**
	     * Compares this instance with another MasterCatalogo.
	     *
	     * @param other The object to compare to
	     * @return True if the objects are the same
	     */
	    @Override
	    public boolean equals(Object other) {
	        if (!(other instanceof MasterCatalogo)) return false;
	        return this.equalKeys(other) && ((MasterCatalogo)other).equalKeys(this);
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
	        i = getIdCatalogo();
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
	        StringBuffer sb = new StringBuffer("[MasterCatalogo |");
	        sb.append(" idCatalogo=").append(getIdCatalogo());
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
	        ret.put("idCatalogo", Integer.valueOf(getIdCatalogo()));
	        return ret;
	    }

	}
