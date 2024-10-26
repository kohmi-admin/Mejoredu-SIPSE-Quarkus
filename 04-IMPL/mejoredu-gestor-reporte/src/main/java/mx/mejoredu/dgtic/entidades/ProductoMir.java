package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Subselect("SELECT * FROM vt_productos_mir")
@Entity
@Table(name = "vt_productos_mir")
@Immutable
public class ProductoMir {
  @Id
  @Column(name = "id_producto", nullable = false)
  private Integer idProducto;
  @Column(name = "cc_externa")
  private String ccExterna;
  @Column(name = "cc_externados")
  private String ccExternos;
  @Column(name = "cve_producto")
  private String cveProducto;
  @Column(name = "cve_actividad")
  private String cveActividad;
  @Column(name = "cve_proyecto")
  private String cveProyecto;
  @Column(name = "categorizacion")
  private String categorizacion;
  @Column(name = "tipo_producto")
  private String tipoProducto;
  @Column(name = "cx_nombre")
  private String cxNombre;
  @Column(name = "id_anhio")
  private Integer idAnhio;
  @Column(name = "id_catalogo_unidad")
  private Integer idCatalogoUnidad;

  public String getCcExternos() {
    return ccExternos;
  }

  public void setCcExternos(String ccExternos) {
    this.ccExternos = ccExternos;
  }

  public Integer getIdProducto() {
    return idProducto;
  }

  public void setIdProducto(Integer idProducto) {
    this.idProducto = idProducto;
  }

  public String getCcExterna() {
    return ccExterna;
  }

  public void setCcExterna(String ccExterna) {
    this.ccExterna = ccExterna;
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

  public Integer getIdAnhio() {
    return idAnhio;
  }

  public void setIdAnhio(Integer idAnhio) {
    this.idAnhio = idAnhio;
  }

  public Integer getIdCatalogoUnidad() {
    return idCatalogoUnidad;
  }

  public void setIdCatalogoUnidad(Integer idCatalogoUnidad) {
    this.idCatalogoUnidad = idCatalogoUnidad;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    ProductoMir that = (ProductoMir) o;
    return getIdProducto() != null && Objects.equals(getIdProducto(), that.getIdProducto());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idProducto = " + idProducto + ")";
  }

  public String getCveActividad() {
    return cveActividad;
  }

  public void setCveActividad(String cveActividad) {
    this.cveActividad = cveActividad;
  }

  public String getCveProyecto() {
    return cveProyecto;
  }

  public void setCveProyecto(String cveProyecto) {
    this.cveProyecto = cveProyecto;
  }

  public String getCategorizacion() {
    return categorizacion;
  }

  public void setCategorizacion(String categorizacion) {
    this.categorizacion = categorizacion;
  }

  public String getTipoProducto() {
    return tipoProducto;
  }

  public void setTipoProducto(String tipoProducto) {
    this.tipoProducto = tipoProducto;
  }
}
