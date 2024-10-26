package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_adecuacion_producto")
@Setter
@Getter
public class AdecuacionProducto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_adecuacion_producto", nullable = false)
  private Integer idAdecuacionProducto;
  @ManyToOne
  @JoinColumn(name = "id_adecuacion_solicitud", referencedColumnName = "id_adecuacion_solicitud", updatable = false, insertable = false)
  private AdecuacionSolicitud adecuacionSolicitud;
  @Column(name = "id_adecuacion_solicitud", nullable = false)
  private Integer idAdecuacionSolicitud;
  @OneToOne
  @JoinColumn(name = "id_producto_modificacion", referencedColumnName = "id_producto", updatable = false, insertable = false)
  private Producto productoModificacion;
  @Column(name = "id_producto_modificacion")
  private Integer idProductoModificacion;
  @ManyToOne
  @JoinColumn(name = "id_producto_referencia", referencedColumnName = "id_producto", updatable = false, insertable = false)
  private Producto productoReferencia;
  @Column(name = "id_producto_referencia")
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

  public boolean hasChangedIndicators() {

    // If the reference and modification products have different indicators, return true
    // MODIFICACION
    if (productoModificacion != null && productoReferencia != null) {
      var nuevoIndicadorMIR = productoModificacion.getIndicadorMIR().map(MasterCatalogo::getId).orElse(null);
      var antiguoIndicadorMIR = productoReferencia.getIndicadorMIR().map(MasterCatalogo::getId).orElse(null);

      var nuevoIndicadorPI = productoModificacion.getIndicadorPI().map(MasterCatalogo::getId).orElse(null);
      var antiguoIndicadorPI = productoReferencia.getIndicadorPI().map(MasterCatalogo::getId).orElse(null);

      return !Objects.equals(nuevoIndicadorMIR, antiguoIndicadorMIR) || !Objects.equals(nuevoIndicadorPI, antiguoIndicadorPI);
    } else if (productoModificacion != null) {
      // If the reference is null and the modification is not and the indicators of the modification are not null, return true
      // ALTA
      return productoModificacion.getIndicadorMIR().isPresent() || productoModificacion.getIndicadorPI().isPresent();
    } else if (productoReferencia != null) {
      // If the modification is null and the reference is not and the indicators of the reference are not null, return true
      // BAJA
      return productoReferencia.getIndicadorMIR().isPresent() || productoReferencia.getIndicadorPI().isPresent();
    } else {
      return false;
    }
  }
}
