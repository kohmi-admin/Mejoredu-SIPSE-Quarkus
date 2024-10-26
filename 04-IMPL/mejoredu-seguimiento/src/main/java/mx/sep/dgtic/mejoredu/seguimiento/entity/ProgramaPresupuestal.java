package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_presupuestal")
public class ProgramaPresupuestal {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_presupuestal", nullable = false)
	private Integer idPresupuestal;
	@Column(name = "df_registro")
	@CreationTimestamp
	private Timestamp dfRegistro;
	@Column(name = "df_actualizacion")
	@UpdateTimestamp
	private Timestamp dfActualizacion;
	@Column(name = "df_aprobacion")
	private Timestamp dfAprobacion;
	@Column(name = "cs_estatus")
	private String csEstatus;
	@Column(name = "cve_usuario", nullable = false)
	private String cveUsuario;
	@Column(name = "id_anhio", nullable = false)
	private Integer idAnhio;
	@Column(name = "id_tipo_programa", nullable = false)
	private Integer idTipoPrograma;
	@Column(name = "id_validacion", nullable = true)
	private Integer idValidacion;
	@Column(name = "id_validacion_planeacion", nullable = true)
	private Integer idValidacionPlaneacion;
	@Column(name = "id_validacion_supervisor", nullable = true)
	private Integer idValidacionSupervisor;

}
