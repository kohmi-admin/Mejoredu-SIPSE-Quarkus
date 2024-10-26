package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "met_archivo")
@Getter @Setter
public class Archivo implements Serializable {

	private static final long serialVersionUID = 317093608895788840L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_archivo", unique = true, nullable = false)
	private Integer idArchivo;
	@Column(name = "cx_nombre", nullable = true, length = 45)
	private String nombre;
	@Column(name = "cx_uuid", nullable = true, length = 45)
	private String uuid;
	@Column(name = "cx_uuid_toPDF", nullable = true, length = 45)
	private String uuidToPdf;
	@Column(name = "df_fecha_carga", nullable = true)
	private LocalDate fechaCarga;
	@Column(name = "dh_hora_carga", nullable = true)
	private LocalTime horaCarga;
	@Column(name = "cs_estatus", nullable = true, length = 1)
	private String estatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_tipo_documento", nullable = true)
	private TipoDocumento tipoDocumento;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", nullable = true)
	@ToString.Exclude
	private Usuario usuario;
	@OneToMany(mappedBy = "archivo")
	@Builder.Default
	@ToString.Exclude
	private List<EvidenciaDocumento> evidenciaDocumentos = new ArrayList<>();

	@Override
	public final boolean equals(Object o) {
		if (this == o) return true;
		if (o == null) return false;
		Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
		Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
		if (thisEffectiveClass != oEffectiveClass) return false;
		Archivo archivo = (Archivo) o;
		return getIdArchivo() != null && Objects.equals(getIdArchivo(), archivo.getIdArchivo());
	}

	@Override
	public final int hashCode() {
		return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" +
				"idArchivo = " + idArchivo + ")";
	}
}
