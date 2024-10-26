package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "met_adecuacion_solicitud")
@Getter @Setter
public class AdecuacionSolicitud {
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_adecuacion_solicitud", nullable = false)
	private Integer idAdecuacionSolicitud;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_modificacion", referencedColumnName = "id_catalogo", nullable = false)
	private MasterCatalogo catalogoModificacion;
	@ManyToOne
	@JoinColumn(name = "id_solicitud", referencedColumnName = "id_solicitud", nullable = false)
	@NotFound(action = NotFoundAction.IGNORE)
	private Solicitud solicitud;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_apartado", referencedColumnName = "id_catalogo", nullable = false)
	private MasterCatalogo catalogoApartado;

	@OneToMany(mappedBy = "adecuacionSolicitud")
	private Set<AdecuacionProducto> productos = new HashSet<>();

	@Override
	public final boolean equals(Object o) {
		if (this == o) return true;
		if (o == null) return false;
		Class<?> oEffectiveClass = o.getClass();
		Class<?> thisEffectiveClass = this.getClass();
		if (thisEffectiveClass != oEffectiveClass) return false;
		AdecuacionSolicitud that = (AdecuacionSolicitud) o;
		return getIdAdecuacionSolicitud() != null && getIdAdecuacionSolicitud().equals(that.getIdAdecuacionSolicitud());
	}

	@Override
	public final int hashCode() {
		return getClass().hashCode();
	}

	public boolean hasChangedIndicators() {
		return productos.stream().anyMatch(AdecuacionProducto::hasChangedIndicators);
	}
}
