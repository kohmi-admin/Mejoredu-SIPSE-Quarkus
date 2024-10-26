package mx.mejoredu.dgtic.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "met_evidencia_trimestral")
public class EvidenciaTrimestral {

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_evidencia_trimestral", nullable = false)
	private Integer idEvidenciaTrimestral;
	@Column(name = "id_articulacion_actividades", nullable = true)
	private Integer idArticulacionActividades;
	@Column(name = "cx_dificultades_superacion", nullable = true, length = 45)
	private String dificultadesSuperacion;
	@Column(name = "cx_meta_superada", nullable = true, length = 45)
	private String metaSuperada;
	
	@Column(name = "df_fecha_sesion", nullable = true)
	private LocalDate fechaSesion;
	@Column(name = "cx_aprobacion_junta_directiva", nullable = true, length = 45)
	private String aprobacionJuntaDirectiva;
	@Column(name = "df_fecha_aprobacion", nullable = true, length = 45)
	private LocalDate fechaAprobacion;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_tipo_publicacion", nullable = true, updatable = false, insertable = false)
	private MasterCatalogo tipoPublicacion;
	@Column(name = "id_tipo_publicacion", nullable = true)
	private Integer idTipoPublicacion;
	@Column(name = "cx_especificar", nullable = true, length = 45)
	private String especificarPublicacion;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_tipo_difusion", nullable = true, updatable = false, insertable = false)
	private MasterCatalogo tipoDifusion;
	@Column(name = "id_tipo_difusion", nullable = true)
	private Integer idTipoDifusion;
	@Column(name = "cx_especificar_difusion", nullable = true, length = 45)
	private String especificarDifusion;

	@OneToOne(mappedBy = "evidenciaTrimestral")
	private Avance avance;

}
