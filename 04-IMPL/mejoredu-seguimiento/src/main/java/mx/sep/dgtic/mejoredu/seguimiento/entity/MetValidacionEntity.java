package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_validacion")
public class MetValidacionEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_validacion", nullable = true)
	private int idValidacion;
	@Column(name = "df_validacion", nullable = true)
	private LocalDate dfValidacion;
	@Column(name = "dh_validacion", nullable = true)
	private LocalTime dhValidacion;
	@Column(name = "cve_usuario_registra", nullable = false, length = 45)
	private String cveUsuarioRegistra;
	@Column(name = "ix_ciclo", nullable = true)
	private Integer ixCiclo;
	@Column(name = "cs_estatus", nullable = true, length = 1)
	private String csEstatus;
	@Column(name = "cve_usuario_actualiza", nullable = false, length = 45)
	private String cveUsuarioActualiza;

}
