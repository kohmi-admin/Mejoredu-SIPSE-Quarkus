package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Table(name = "met_archivo")
@Getter @Setter
public class Archivo implements Serializable {
	private static final long serialVersionUID = 317093608895788840L;

	protected static final String PK = "idArchivo";

	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id_archivo", unique = true, nullable = false)
	private Integer idArchivo;
	@Column(name = "cx_nombre", nullable = true)
	private String cxNombre;
	@Column(name = "cx_uuid", nullable = true)
	private String cxUuid;
	@Column(name = "cx_uuid_toPDF", nullable = true)
	private String cxUuidToPdf;
	@ManyToOne
	@JoinColumn(name = "id_tipo_documento", nullable = true)
	private TipoDocumento tipoDocumento;
	@Column(name = "df_fecha_carga", nullable = true)
	private LocalDate dfFechaCarga;
	@Column(name = "dh_hora_carga", nullable = true)
	private LocalTime dfHoraCarga;
	@Column(name = "cs_estatus", nullable = true)
	private String csEstatus;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cve_usuario", nullable = true)
	private Usuario usuario;

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;

		Archivo archivo = (Archivo) o;

		if (!Objects.equals(idArchivo, archivo.idArchivo))
			return false;
		if (!Objects.equals(cxNombre, archivo.cxNombre))
			return false;
		if (!Objects.equals(cxUuid, archivo.cxUuid))
			return false;
		if (!Objects.equals(tipoDocumento, archivo.tipoDocumento))
			return false;
		
		if (!Objects.equals(dfFechaCarga, archivo.dfFechaCarga))
			return false;
		if (!Objects.equals(dfHoraCarga, archivo.dfHoraCarga))
			return false;
		if (!Objects.equals(csEstatus, archivo.csEstatus))
			return false;
		return Objects.equals(usuario, archivo.usuario);
	}

	@Override
	public int hashCode() {
		int result = idArchivo != null ? idArchivo.hashCode() : 0;
		result = 31 * result + (cxNombre != null ? cxNombre.hashCode() : 0);
		result = 31 * result + (cxUuid != null ? cxUuid.hashCode() : 0);
		result = 31 * result + (tipoDocumento != null ? tipoDocumento.hashCode() : 0);
		result = 31 * result + (dfFechaCarga != null ? dfFechaCarga.hashCode() : 0);
		result = 31 * result + (dfHoraCarga != null ? dfHoraCarga.hashCode() : 0);
		result = 31 * result + (csEstatus != null ? csEstatus.hashCode() : 0);
		result = 31 * result + (usuario != null ? usuario.hashCode() : 0);
		return result;
	}

	@Override
	public String toString() {
		return "Archivo{" + "idArchivo=" + idArchivo + ", cxNombre='" + cxNombre + '\'' + ", cxUuid='" + cxUuid + '\''
				+ ", tipoDocumento=" + tipoDocumento + ", dfFechaCarga="
				+ dfFechaCarga + ", dfHoraCarga=" + dfHoraCarga + ", csEstatus='" + csEstatus + '\'' + ", usuario="
				+ usuario + '}';
	}
}
