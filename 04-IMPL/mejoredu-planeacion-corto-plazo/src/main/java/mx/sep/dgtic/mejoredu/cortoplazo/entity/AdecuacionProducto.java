package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_adecuacion_producto")
@Setter @Getter
public class AdecuacionProducto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_adecuacion_producto", nullable = false)
  private Integer idAdecuacionProducto;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @OneToOne
  @JoinColumn(name = "id_producto_modificacion", referencedColumnName = "id_producto", updatable = false, insertable = false)
  private Producto productoModificacion;
  @Column(name = "id_producto_modificacion", nullable = false)
  private Integer idProductoModificacion;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_producto_referencia", referencedColumnName = "id_producto", updatable = false, insertable = false)
  private Producto productoReferencia;
  @Column(name = "id_producto_referencia", nullable = false)
  private Integer idProductoReferencia;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AdecuacionProducto that = (AdecuacionProducto) o;
    return getIdAdecuacionProducto() != null && Objects.equals(getIdAdecuacionProducto(), that.getIdAdecuacionProducto());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idAdecuacionProducto = " + idAdecuacionProducto + ")";
  }
}
