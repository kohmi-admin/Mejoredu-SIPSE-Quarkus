package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "met_justificacion")
public class Justificacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_justificacion")
	private Integer idJustificacion;
	@Column(name = "id_indicador_mir")
	private Integer idIndicador;
	@ManyToOne
	@JoinColumn(name = "id_indicador_mir", insertable = false, updatable = false)
	private IndicadorResultado indicadorResultado;

	@Column(name = "cx_indicador")
	private String indicador;
	@Column(name = "cx_registro_avance")
	private String registroAvance;
	@Column(name = "cx_causa")
	private String causa;
	@Column(name = "cx_efectos")
	private String efecto;
	@Column(name = "cx_otros_motivos")
	private String otrosMotivos;

}
