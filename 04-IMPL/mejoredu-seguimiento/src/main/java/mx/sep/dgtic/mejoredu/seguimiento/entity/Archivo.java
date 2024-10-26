package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_archivo")
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
	@ManyToOne
	@JoinColumn(name = "id_tipo_documento", nullable = true)
	private TipoDocumento tipoDocumento;

	@Column(name = "df_fecha_carga", nullable = true)
	private LocalDate fechaCarga;
	@Column(name = "dh_hora_carga", nullable = true)
	private LocalTime horaCarga;

	@Column(name = "cs_estatus", nullable = true, length = 1)
	private String estatus;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", nullable = true)
	private Usuario usuario;

}
