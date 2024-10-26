package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "met_solicitud_comentario")
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudComentario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_comentario", unique = true, nullable = false)
	private Integer idComentario;
	@Column(name = "cd_comentario", nullable = false, length = 500)
	private String comentario;
	@Column(name = "df_seguimiento", nullable = false)
	private LocalDate dfSeguimiento;
	@Column(name = "dh_seguimiento", nullable = true)
	private LocalTime dhSeguimiento;
	@ManyToOne
	@JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", nullable = false)
	private Usuario usuario;
	@ManyToOne
	@JoinColumn(name = "id_solicitud", referencedColumnName = "id_solicitud", nullable = false)
	private Solicitud solicitud;

}
