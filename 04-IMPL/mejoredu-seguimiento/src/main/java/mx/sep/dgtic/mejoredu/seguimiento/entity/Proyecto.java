package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_cortoplazo_proyecto")
@Getter @Setter
public class Proyecto {

	/** Primary key. */
	protected static final String PK = "idProyecto";

	/**
	 * The optimistic lock. Available via standard bean get/set operations.
	 */
	@Version
	@Column(name = "LOCK_FLAG")
	private Integer lockFlag;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_proyecto", unique = true, nullable = false, precision = 10)
	private Integer idProyecto;
	@Column(name = "cve_proyecto", nullable = false, precision = 10)
	private int cveProyecto;
	@Column(name = "cx_nombre_proyecto", nullable = false, length = 90)
	private String cxNombreProyecto;
	@Column(name = "cx_objetivo", nullable = false, length = 100)
	private String cxObjetivo;
	@Column(name = "cx_objetivo_prioritario", nullable = true, length = 300)
	private String cxObjetivoPrioritario;
	@Column(name = "df_proyecto")
	private LocalDate dfProyecto;
	@Column(name = "dh_proyecto")
	private LocalTime dhProyecto;
	@Column(name = "cs_estatus", length = 1)
	private String csEstatus;
	@Column(name = "cx_nombre_unidad", length = 90)
	private String cxNombreUnidad;
	@Column(name = "cve_unidad", length = 45)
	private String cveUnidad;
	@Column(name = "cx_alcance", length = 200)
	private String cxAlcance;
	@Column(name = "cx_fundamentacion", length = 200)
	private String cxFundamentacion;
	@Column(name = "ix_fuente_registro", length = 1)
	private Integer ix_fuente_registro;
	@OneToMany(mappedBy = "proyectoAnual")
	private List<ProyectoContribucion> proyectoContribucion = new ArrayList<>();
	@ManyToOne(optional = false)
	@JoinColumn(name = "id_anhio", nullable = true)
	private AnhoPlaneacion anhoPlaneacion;
	@ManyToOne(optional = false)
	@JoinColumn(name = "id_archivo", nullable = true)
	private Archivo archivo;
	@ManyToOne(optional = false)
	@JoinColumn(name = "cve_usuario", nullable = true)
	private Usuario usuario;
	@Column(name = "df_actualizacion", length = 45)
	private LocalDate dfactualizacion;
	@Column(name = "dh_actualizacion", length = 45)
	private LocalTime dhActualizacion;
	@Column(name = "cve_usuario_actualiza", length = 45)
	private String cveUsuarioActualiza;
	@Column(name = "id_validacion", nullable = true)
	private Integer idValidacion;
	@Column(name = "id_validacion_planeacion", nullable = true)
	private Integer idValidacionPlaneacion;
	@Column(name = "id_validacion_supervisor", nullable = true)
	private Integer idValidacionSupervisor;
	@Column(name = "it_semantica", nullable = true)
	private Integer itSemantica;
	@Column(name = "ix_accion", nullable = true)
	private Integer ixAccion;

	@ManyToOne
	@JoinColumn(name = "id_catalogo_unidad")
	private MasterCatalogo unidadAdministrativa;

	@OneToMany(mappedBy = "proyectoModificacion", fetch = FetchType.LAZY)
	private List<AdecuacionProyecto> adecuacionProyecto = new ArrayList<>();
	@OneToMany(mappedBy = "proyectoReferencia")
	private List<AdecuacionProyecto> adecuacionProyectoReferencia = new ArrayList<>();
	/**
	 * Compares the key for this instance with another seguimientoProyecto.
	 *
	 * @param other The object to compare to
	 * @return True if other object is instance of class seguimientoProyecto and the
	 *         key objects are equal
	 */
	private boolean equalKeys(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof Proyecto)) {
			return false;
		}
		Proyecto that = (Proyecto) other;
		if (this.getIdProyecto() != that.getIdProyecto()) {
			return false;
		}
		return true;
	}

	/**
	 * Compares this instance with another seguimientoProyecto.
	 *
	 * @param other The object to compare to
	 * @return True if the objects are the same
	 */
	@Override
	public boolean equals(Object other) {
		if (!(other instanceof Proyecto))
			return false;
		return this.equalKeys(other) && ((Proyecto) other).equalKeys(this);
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
		result = 37 * result + i;
		return result;
	}

	/**
	 * Returns a debug-friendly String representation of this instance.
	 *
	 * @return String representation of this instance
	 */
	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer("[seguimientoProyecto |");
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
