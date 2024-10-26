package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.io.Serializable;
import java.util.Objects;

import org.hibernate.proxy.HibernateProxy;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class JustificacionProductoPK implements Serializable {

	private static final long serialVersionUID = -2323182516907262160L;
	@Column(name = "id_producto", nullable = false)
	private Integer idProducto;
	@Column(name = "ix_trimestre")
	private Integer ixTrimestre;

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
		JustificacionProductoPK that = (JustificacionProductoPK) o;
		return getIxTrimestre() != null && Objects.equals(getIxTrimestre(), that.getIxTrimestre())
				&& getIdProducto() != null && Objects.equals(getIdProducto(), that.getIdProducto());
	}

	@Override
	public final int hashCode() {
		return Objects.hash(ixTrimestre, idProducto);
	}
}
