package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Subselect("SELECT * FROM vt_productos_mir")
@Entity
@Table(name = "vt_productos_mir")
@Immutable
@Getter @Setter
public class ProductoMir {
  @Id
  @Column(name = "id_producto", nullable = false)
  private Integer idProducto;
  @Column(name = "cc_externa")
  private String ccExterna;
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
  @Column(name = "cve_unidad")
  private String cveUnidad;

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
}
