package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.proxy.HibernateProxy;

import java.util.List;
import java.util.Objects;

//@Subselect("select * from vt_indicadores_mir")
@Entity
@Table(name = "vt_indicadores_mir")
@Immutable
public class IndicadorMir {
  @Id
  @Column(name = "id_producto", nullable = false)
  private Integer idProducto;
  @Column(name = "id_catalogo_indicador")
  private Integer idCatalogoIndicador;
  @Column(name = "cd_opcion")
  private String cdOpcion;
  @Column(name = "cc_externa")
  private String ccExterna;
  @Column(name = "cc_externaDos")
  private String ccExternaDos;
  @Column(name = "id_anhio")
  private Integer idAnhio;
  @Column(name = "id_catalogo_unidad")
  private Integer idCatalogoUnidad;
  @OneToMany(mappedBy = "productoMir")
  private List<ProductoCalendario> productoCalendario;

  public Integer getIdProducto() {
    return idProducto;
  }

  public void setIdProducto(Integer idProducto) {
    this.idProducto = idProducto;
  }

  public Integer getIdCatalogoIndicador() {
    return idCatalogoIndicador;
  }

  public void setIdCatalogoIndicador(Integer idCatalogoIndicador) {
    this.idCatalogoIndicador = idCatalogoIndicador;
  }

  public String getCdOpcion() {
    return cdOpcion;
  }

  public void setCdOpcion(String cdOpcion) {
    this.cdOpcion = cdOpcion;
  }

  public String getCcExterna() {
    return ccExterna;
  }

  public void setCcExterna(String ccExterna) {
    this.ccExterna = ccExterna;
  }

  public String getCcExternaDos() {
    return ccExternaDos;
  }

  public void setCcExternaDos(String ccExternaDos) {
    this.ccExternaDos = ccExternaDos;
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
    IndicadorMir that = (IndicadorMir) o;
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

  public List<ProductoCalendario> getProductoCalendario() {
    return productoCalendario;
  }

  public void setProductoCalendario(List<ProductoCalendario> productoCalendario) {
    this.productoCalendario = productoCalendario;
  }
}
