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
import lombok.Data;

@Data
@Entity
@Table(name = "met_solicitud_firma")
public class SolicitudFirma {
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_firma", nullable = false)
	private int idFirma;
	@Column(name = "df_firma", nullable = true)
	private LocalDate dfFirma;
	@Column(name = "dh_firma", nullable = true, length = 45)
	private LocalTime dhFirma;

	@ManyToOne
	@JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", nullable = false)
	private Usuario usuario;
	@ManyToOne
	@JoinColumn(name = "id_solicitud", referencedColumnName = "id_solicitud", nullable = false)
	private Solicitud solicitud;
	@ManyToOne
	@JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo", nullable = false)
	private Archivo archivo;

}
