package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "met_partida_adecuacion")
public class AjustadorPartida {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_ajuste_partida", nullable = false)
	private Integer id;
	@Column(name = "id_partida_gasto")
	private Integer idPartida;
	@Column(name = "id_adecuacion_solicitud")
	private Integer idAdecuacionSolicitud;
	
	@Column(name = "id_presupuesto")
	private Integer idPresupuesto;
	
	@Column(name = "ix_mes")
	private Integer ixMes;

	@Column(name = "ix_monto")
	private Double ixMonto;

	@Column(name = "ix_tipo")
	private Integer tipo;

	@Column(name = "cve_partida")
	private String cvePresupuestal;

	@Column(name = "cs_estatus")
	private String csEstatus;

}
