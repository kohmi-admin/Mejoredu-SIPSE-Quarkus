package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.hibernate.proxy.HibernateProxy;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_cortoplazo_actividad")
@Setter
@Getter
public class Actividad {
	// Id Autoincrementable
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_actividad", unique = true, nullable = false)
	private Integer idActividad;
	@Column(name = "cve_actividad", nullable = false)
	private Integer cveActividad;
	@Column(name = "cx_nombre_actividad", nullable = false)
	private String cxNombreActividad;
	@Column(name = "cx_descripcion", nullable = true)
	private String cxDescripcion;
	@Column(name = "cx_articulacion_actividad", nullable = true)
	private String cxArticulacionActividad;
	@ManyToOne
	@JoinColumn(name = "cve_usuario", nullable = false)
	private Usuario usuario;
	@Column(name = "df_actividad", nullable = true)
	private Date dfActividad;
	@Column(name = "dh_actividad", nullable = true)
	private Time dhActividad;
	@ManyToOne
	@JoinColumn(name = "id_proyecto", nullable = false)
	private Proyecto proyectoAnual;

	@Column(name = "ic_actividad_transversal", nullable = true)
	private Integer icActividadTransversal;
	@Column(name = "ix_requiere_reunion", nullable = true)
	private Integer ixRequireReunion;
	@Column(name = "cx_tema", nullable = true)
	private String cxTema;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_alcance", nullable = true)
	private MasterCatalogo catalogoAlcance;
	@Column(name = "cx_lugar", nullable = true)
	private String cxLugar;
	@Column(name = "cx_actores", nullable = true)
	private String cxActores;
	@Column(name = "cs_estatus", nullable = true)
	private String csEstatus;

	@Column(name = "id_validacion", nullable = true)
	private Integer idValidacion;

	@Column(name = "id_validacion_planeacion", nullable = true)
	private Integer idValidacionPlaneacion;

	@Column(name = "id_validacion_supervisor", nullable = true)
	private Integer idValidacionSupervisor;

	@OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
	private List<EstrategiaAccion> estrategiaAccion = new ArrayList<>();;

	@OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
	private List<FechaTentativa> fechaTentativa = new ArrayList<>();

	@OneToMany(mappedBy = "actividadModificacion")
	private List<AdecuacionActividad> adecuacionActividad = new ArrayList<>();
	@OneToMany(mappedBy = "actividadReferencia")
	private List<AdecuacionActividad> adecuacionActividadReferencia = new ArrayList<>();

	public void addFechaTentativa(FechaTentativa fechaTentativa) {
		this.fechaTentativa.add(fechaTentativa);
	}

	public void addEstrategiaAccion(EstrategiaAccion estrategiaAccion) {
		this.estrategiaAccion.add(estrategiaAccion);
	}

	@Override
	public final boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null)
			return false;
		Class<?> oEffectiveClass = o instanceof HibernateProxy
				? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass()
				: o.getClass();
		Class<?> thisEffectiveClass = this instanceof HibernateProxy
				? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass()
				: this.getClass();
		if (thisEffectiveClass != oEffectiveClass)
			return false;
		Actividad actividad = (Actividad) o;
		return getIdActividad() != null && Objects.equals(getIdActividad(), actividad.getIdActividad());
	}

	@Override
	public final int hashCode() {
		return this instanceof HibernateProxy
				? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode()
				: getClass().hashCode();
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" + "idActividad = " + idActividad + ")";
	}
}
