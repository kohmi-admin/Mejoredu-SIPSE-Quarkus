package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.util.Objects;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import lombok.Data;

@Entity
@Table(name = "met_justificacion_producto")
@Getter @Setter
public class JustificacionProducto {
	@EmbeddedId
	private JustificacionProductoPK id;

	@ManyToOne
	@JoinColumn(name = "id_producto", insertable = false, updatable = false)
	private Producto producto;

	@Column(name = "cx_causa")
	private String causa;
	@Column(name = "cx_efectos")
	private String efectos;
	@Column(name = "cx_otros_motivos")
	private String otrosMotivos;

	@Override
	public final boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null)
			return false;
		Class<?> oEffectiveClass = o instanceof HibernateProxy
				? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass()
				: o.getClass();
		Class<?> thisEffectiveClass = this instanceof HibernateProxy
				? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass()
				: this.getClass();
		if (thisEffectiveClass != oEffectiveClass)
			return false;
		JustificacionProducto that = (JustificacionProducto) o;
		return getId() != null && Objects.equals(getId(), that.getId());
	}

	@Override
	public final int hashCode() {
		return Objects.hash(id);
	}
}
