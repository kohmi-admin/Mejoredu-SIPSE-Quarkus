package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_producto_calendario")
public class ProductoCalendario {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_prodcal", unique = true, nullable = false)
  private Integer idProductoCalendario;
  @Column(name = "ci_mes", nullable = true)
  private Integer ciMes;
  @Column(name = "ci_monto", nullable = true)
  private Integer ciMonto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_producto", updatable = false, insertable = false)
  private Producto producto;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_producto", updatable = false, insertable = false)
  private IndicadorMir productoMir;
  @Column(name = "id_producto")
  private Integer idProducto;

  public Integer getIdProductoCalendario() {
    return idProductoCalendario;
  }

  public void setIdProductoCalendario(Integer idProductoCalendario) {
    this.idProductoCalendario = idProductoCalendario;
  }

  public Integer getCiMes() {
    return ciMes;
  }

  public void setCiMes(Integer ciMes) {
    this.ciMes = ciMes;
  }

  public Integer getCiMonto() {
    return ciMonto;
  }

  public void setCiMonto(Integer ciMonto) {
    this.ciMonto = ciMonto;
  }

  public Producto getProducto() {
    return producto;
  }

  public void setProducto(Producto producto) {
    this.producto = producto;
  }

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    ProductoCalendario that = (ProductoCalendario) o;
    return getIdProductoCalendario() != null && Objects.equals(getIdProductoCalendario(), that.getIdProductoCalendario());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
      "idProductoCalendario = " + idProductoCalendario + ")";
  }

  public Integer getIdProducto() {
    return idProducto;
  }

  public void setIdProducto(Integer idProducto) {
    this.idProducto = idProducto;
  }

  public IndicadorMir getProductoMir() {
    return productoMir;
  }

  public void setProductoMir(IndicadorMir productoMir) {
    this.productoMir = productoMir;
  }
}