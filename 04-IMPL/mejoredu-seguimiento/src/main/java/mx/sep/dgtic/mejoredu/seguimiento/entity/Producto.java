// Generated with g9.

package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

import mx.edu.sep.dgtic.mejoredu.dao.entity.JustificacionIndicador;
import org.hibernate.Hibernate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_cortoplazo_producto")
@Getter
@Setter
public class Producto {
	/**
	 * Primary key.
	 */
	protected static final String PK = "idProducto";
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_producto", unique = true, nullable = false)
	private Integer idProducto;
	@ManyToOne(optional = false)
	@JoinColumn(name = "cve_usuario", nullable = false)
	private Usuario usuario;
	@ManyToOne(optional = false)
	@JoinColumn(name = "id_actividad", nullable = false)
	private Actividad actividad;
	@Column(name = "cve_producto")
	private String cveProducto;
	@Column(name = "cx_nombre")
	private String cxNombre;
	@Column(name = "cx_descripcion")
	private String cxDescripcion;
	@Column(name = "df_producto", nullable = true)
	private Date dfProducto;
	@Column(name = "dh_producto", nullable = true)
	private Time dhProducto;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_categorizacion")
	private MasterCatalogo categorizacion;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_tipo_producto")
	private MasterCatalogo tipoProducto;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_indicador")
	private MasterCatalogo indicadorMIR;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_indicador_pl")
	private MasterCatalogo indicadorPI;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_nivel_educativo")
	private MasterCatalogo nivelEducativo;
	@Column(name = "cx_vinculacion_producto")
	private String cxVinculacionProducto;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_continuidad")
	private MasterCatalogo continuidad;
	@Column(name = "cb_por_publicar")
	private String cbPorPublicar;
	@Column(name = "id_catalogo_anhio_pub")
	private Integer anhioPublicacion;
	@Column(name = "cx_cvenombre_potic")
	private String cxCvenombrePotic;
	@OneToMany(mappedBy = "producto", fetch = FetchType.EAGER)
	private List<ProductoCalendario> productoCalendario = new ArrayList<>();
	@Column(name = "cs_estatus")
	private String csEstatus;
	@Column(name = "id_validacion", nullable = true)
	private Integer idValidacion;
	@Column(name = "id_validacion_planeacion", nullable = true)
	private Integer idValidacionPlaneacion;
	@Column(name = "id_validacion_supervisor", nullable = true)
	private Integer idValidacionSupervisor;
	@OneToMany(mappedBy = "productoModificacion")
	private List<AdecuacionProducto> adecuacionProducto = new ArrayList<>();
	@OneToMany(mappedBy = "productoReferencia")
	private List<AdecuacionProducto> adecuacionProductoReferencia = new ArrayList<>();
	@ManyToOne
	@JoinColumn(name = "id_justificacion_mir", referencedColumnName = "id_justificacion_indicador", updatable = false, insertable = false)
	private JustificacionIndicador justificacionIndicadorMIR;
	@Column(name = "id_justificacion_mir")
	private Integer idJustificacionMIR;

	@ManyToOne
	@JoinColumn(name = "id_justificacion_pi", referencedColumnName = "id_justificacion_indicador", updatable = false, insertable = false)
	private JustificacionIndicador justificacionIndicadorPI;
	@Column(name = "id_justificacion_pi")
	private Integer idJustificacionPI;

	@OneToMany(mappedBy = "producto")
	private Set<JustificacionProducto> justificacionProducto = new HashSet<>();

	public Optional<MasterCatalogo> getCategorizacion() {
		return Optional.ofNullable(categorizacion);
	}

	public Optional<MasterCatalogo> getTipoProducto() {
		return Optional.ofNullable(tipoProducto);
	}

	public Optional<MasterCatalogo> getIndicadorMIR() {
		return Optional.ofNullable(indicadorMIR);
	}

	public Optional<MasterCatalogo> getIndicadorPI() {
		return Optional.ofNullable(indicadorPI);
	}

	public Optional<MasterCatalogo> getNivelEducativo() {
		return Optional.ofNullable(nivelEducativo);
	}

	public Optional<MasterCatalogo> getContinuidad() {
		return Optional.ofNullable(continuidad);
	}

	public void addProductoCalendario(ProductoCalendario productoCalendario) {
		this.productoCalendario.add(productoCalendario);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
			return false;
		Producto producto = (Producto) o;
		return Objects.equals(getIdProducto(), producto.getIdProducto());
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" + "idProducto = " + idProducto + ")";
	}
}
