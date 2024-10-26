package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "met_presupuesto_calendario")

public class PresupuestoCalendario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_calendario")
	private Integer idCalendario;
	@Column(name = "ix_mes")
	private Integer ixMes;
	@Column(name = "ix_monto")
	private Double ixMonto;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_partida")
	private PartidaGasto partidaGasto;

	public Integer getIdCalendario() {
		return idCalendario;
	}

	public void setIdCalendario(Integer idCalendario) {
		this.idCalendario = idCalendario;
	}

	public Integer getIxMes() {
		return ixMes;
	}

	public void setIxMes(Integer ixMes) {
		this.ixMes = ixMes;
	}

	public Double getIxMonto() {
		return ixMonto;
	}

	public void setIxMonto(Double ixMonto) {
		this.ixMonto = ixMonto;
	}

	public PartidaGasto getPartidaGasto() {
		return partidaGasto;
	}

	public void setPartidaGasto(PartidaGasto partidaGasto) {
		this.partidaGasto = partidaGasto;
	}

	public PresupuestoCalendario(Integer idCalendario, Integer ixMes, Double ixMonto, PartidaGasto partidaGasto) {
		super();
		this.idCalendario = idCalendario;
		this.ixMes = ixMes;
		this.ixMonto = ixMonto;
		this.partidaGasto = partidaGasto;
	}

	public PresupuestoCalendario() {
		super();
		// TODO Auto-generated constructor stub
	}

}
