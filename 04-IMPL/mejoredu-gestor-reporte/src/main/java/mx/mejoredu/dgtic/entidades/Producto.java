package mx.mejoredu.dgtic.entidades;


import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.*;

@Entity
@Table(name = "met_cortoplazo_producto")
public class Producto {
	/**
	 * Primary key.
	 */
	protected static final String PK = "idProducto";
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_producto", unique = true, nullable = false)
	private Integer idProducto;
	@Column(name = "cve_usuario", nullable = false)
	private String usuario;
	@Column(name = "id_actividad", nullable = false)
	private Integer actividad;
	@Column(name = "cve_producto")
	private String cveProducto;
	@Column(name = "cx_nombre")
	private String cxNombre;
	@Column(name = "cx_descripcion")
	private String cxDescripcion;
	@Column(name = "id_catalogo_categorizacion")
	private Integer categorizacion;
	@Column(name = "id_catalogo_tipo_producto")
	private Integer tipoProducto;
	@Column(name = "id_catalogo_indicador")
	private Integer indicadorMIR;
	@Column(name = "id_catalogo_indicador_pl")
	private Integer indicadorPI;
	@Column(name = "id_catalogo_nivel_educativo")
	private Integer nivelEducativo;
	@Column(name = "cx_vinculacion_producto")
	private String cxVinculacionProducto;
	@Column(name = "id_catalogo_continuidad")
	private Integer continuidad;
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

	public Integer getIdProducto() {
		return idProducto;
	}

	public void setIdProducto(Integer idProducto) {
		this.idProducto = idProducto;
	}

	public String getUsuario() {
		return usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public Integer getActividad() {
		return actividad;
	}

	public void setActividad(Integer actividad) {
		this.actividad = actividad;
	}

	public String getCveProducto() {
		return cveProducto;
	}

	public void setCveProducto(String cveProducto) {
		this.cveProducto = cveProducto;
	}

	public String getCxNombre() {
		return cxNombre;
	}

	public void setCxNombre(String cxNombre) {
		this.cxNombre = cxNombre;
	}

	public String getCxDescripcion() {
		return cxDescripcion;
	}

	public void setCxDescripcion(String cxDescripcion) {
		this.cxDescripcion = cxDescripcion;
	}

	public Optional<Integer> getCategorizacion() {
		return Optional.ofNullable(categorizacion);
	}

	public void setCategorizacion(Integer categorizacion) {
		this.categorizacion = categorizacion;
	}

	public Optional<Integer> getTipoProducto() {
		return Optional.ofNullable(tipoProducto);
	}

	public void setTipoProducto(Integer tipoProducto) {
		this.tipoProducto = tipoProducto;
	}

	public Optional<Integer> getIndicadorMIR() {
		return Optional.ofNullable(indicadorMIR);
	}

	public void setIndicadorMIR(Integer indicadorMIR) {
		this.indicadorMIR = indicadorMIR;
	}

	public Optional<Integer> getIndicadorPI() {
		return Optional.ofNullable(indicadorPI);
	}

	public void setIndicadorPI(Integer indicadorPI) {
		this.indicadorPI = indicadorPI;
	}

	public Optional<Integer> getNivelEducativo() {
		return Optional.ofNullable(nivelEducativo);
	}

	public void setNivelEducativo(Integer nivelEducativo) {
		this.nivelEducativo = nivelEducativo;
	}

	public String getCxVinculacionProducto() {
		return cxVinculacionProducto;
	}

	public void setCxVinculacionProducto(String cxVinculacionProducto) {
		this.cxVinculacionProducto = cxVinculacionProducto;
	}

	public Optional<Integer> getContinuidad() {
		return Optional.ofNullable(continuidad);
	}

	public void setContinuidad(Integer continuidad) {
		this.continuidad = continuidad;
	}

	public String getCbPorPublicar() {
		return cbPorPublicar;
	}

	public void setCbPorPublicar(String cbPorPublicar) {
		this.cbPorPublicar = cbPorPublicar;
	}

	public Integer getAnhioPublicacion() {
		return anhioPublicacion;
	}

	public void setAnhioPublicacion(Integer anhioPublicacion) {
		this.anhioPublicacion = anhioPublicacion;
	}

	public String getCxCvenombrePotic() {
		return cxCvenombrePotic;
	}

	public void setCxCvenombrePotic(String cxCvenombrePotic) {
		this.cxCvenombrePotic = cxCvenombrePotic;
	}

	public List<ProductoCalendario> getProductoCalendario() {
		return productoCalendario;
	}

	public void setProductoCalendario(List<ProductoCalendario> productoCalendario) {
		this.productoCalendario = productoCalendario;
	}

	public void addProductoCalendario(ProductoCalendario productoCalendario) {
		this.productoCalendario.add(productoCalendario);
	}

	public String getCsEstatus() {
		return csEstatus;
	}

	public void setCsEstatus(String csEstatus) {
		this.csEstatus = csEstatus;
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
