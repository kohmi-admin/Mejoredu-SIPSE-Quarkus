package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "met_partida_gasto")

public class PartidaGasto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_partida")
	private Integer idPartida;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_presupuesto")
	private Presupuesto presupuesto;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_catalogo_partida", updatable = false, insertable = false)
	private MasterCatalogo catalogoPartida;
	@Column(name = "id_catalogo_partida")
	private Integer idCatalogoPartida;
	@OneToMany(mappedBy = "partidaGasto", fetch = FetchType.EAGER, orphanRemoval = true, cascade = CascadeType.ALL)
	private List<PresupuestoCalendario> calendarios = new ArrayList<>();
	@Column(name = "ix_anual", columnDefinition = "Decimal(11,2)")
	private Double ixAnual;

	public Integer getIdPartida() {
		return idPartida;
	}

	public void setIdPartida(Integer idPartida) {
		this.idPartida = idPartida;
	}

	public Presupuesto getPresupuesto() {
		return presupuesto;
	}

	public void setPresupuesto(Presupuesto presupuesto) {
		this.presupuesto = presupuesto;
	}

	public MasterCatalogo getCatalogoPartida() {
		return catalogoPartida;
	}

	public void setCatalogoPartida(MasterCatalogo catalogoPartida) {
		this.catalogoPartida = catalogoPartida;
	}

	public Integer getIdCatalogoPartida() {
		return idCatalogoPartida;
	}

	public void setIdCatalogoPartida(Integer idCatalogoPartida) {
		this.idCatalogoPartida = idCatalogoPartida;
	}

	public List<PresupuestoCalendario> getCalendarios() {
		return calendarios;
	}

	public void setCalendarios(List<PresupuestoCalendario> calendarios) {
		this.calendarios = calendarios;
	}

	public Double getIxAnual() {
		return ixAnual;
	}

	public void setIxAnual(Double ixAnual) {
		this.ixAnual = ixAnual;
	}

	public PartidaGasto(Integer idPartida, Presupuesto presupuesto, MasterCatalogo catalogoPartida,
			Integer idCatalogoPartida, List<PresupuestoCalendario> calendarios, Double ixAnual) {
		super();
		this.idPartida = idPartida;
		this.presupuesto = presupuesto;
		this.catalogoPartida = catalogoPartida;
		this.idCatalogoPartida = idCatalogoPartida;
		this.calendarios = calendarios;
		this.ixAnual = ixAnual;
	}

	public PartidaGasto() {
		super();
		// TODO Auto-generated constructor stub
	}

}
