package mx.sep.dgtic.mejoredu.seguimiento.entity;

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
@Table(name = "met_presupuestal_justificacion")
public class PresupuestalJustificacion {
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_presupuestal_justificacion", nullable = false)
	private int idPresupuestalJustificacion;

	@Column(name = "periodo", nullable = true, length = 120)
	private String periodo;
	@Column(name = "meta_esperada", nullable = true, length = 50)
	private String metaEsperada;
	@Column(name = "numerador", nullable = true, length = 50)
	private String numerador;
	@Column(name = "denominador", nullable = true, length = 50)
	private String denominador;
	@Column(name = "indicador", nullable = true, length = 50)
	private String indicador;
	@Column(name = "tipo_ajuste", nullable = true, length = 50)
	private String tipoAjuste;
	@Column(name = "causas", nullable = true, length = 120)
	private String causas;
	@Column(name = "efectos", nullable = true, length = 120)
	private String efectos;
	@Column(name = "otros_motivos", nullable = true, length = 120)
	private String otrosMotivos;
	@ManyToOne
	@JoinColumn(name = "id_ficha_indicadores", referencedColumnName = "id_ficha_indicadores", nullable = false)
	private FichaIndicadores fichaIndicadores;

}
