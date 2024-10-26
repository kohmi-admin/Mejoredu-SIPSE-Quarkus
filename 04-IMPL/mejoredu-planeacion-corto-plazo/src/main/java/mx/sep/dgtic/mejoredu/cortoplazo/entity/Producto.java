// Generated with g9.

package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.*;

@Entity
@Table(name = "met_cortoplazo_producto")
@Getter @Setter
public class Producto extends ValidableBase {
	/**
	 * Primary key.
	 */
	protected static final String PK = "idProducto";
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_producto", unique = true, nullable = false)
	private Integer idProducto;
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "cve_usuario", nullable = false)
	private Usuario usuario;
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "id_actividad", nullable = false)
	private Actividad actividad;
	@Column(name = "cve_producto")
	private String cveProducto;
	@Column(name = "cx_nombre")
	private String cxNombre;
	@Column(name = "cx_descripcion")
	private String cxDescripcion;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_catalogo_categorizacion")
	private MasterCatalogo categorizacion;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_catalogo_tipo_producto")
	private MasterCatalogo tipoProducto;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_catalogo_indicador", nullable = true)
	private MasterCatalogo indicadorMIR;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_catalogo_indicador_pl", nullable = true)
	private MasterCatalogo indicadorPI;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_catalogo_nivel_educativo", nullable = true)
	private MasterCatalogo nivelEducativo;
	@Column(name = "cx_vinculacion_producto")
	private String cxVinculacionProducto;
	@ManyToOne(fetch = FetchType.LAZY)
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
	@OneToOne(mappedBy = "productoModificacion")
	private AdecuacionProducto adecuacionProductoModificacion;
	@Column(name = "id_indicador_pi")
	private Integer idIndicadorPI;

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
