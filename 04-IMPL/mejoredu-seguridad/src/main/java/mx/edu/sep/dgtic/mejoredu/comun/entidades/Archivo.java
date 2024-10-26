package mx.edu.sep.dgtic.mejoredu.comun.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.Usuario;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity(name = "met_archivo")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
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

}
