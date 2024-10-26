package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_solicitud")
public class Solicitud {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_solicitud", unique = true, nullable = false)
	private Integer idSolicitud;
	@Column(name = "cve_folio_solicitud", nullable = true, length = 45)
	private String folioSolicitud;
	@Column(name = "cve_folio_SIF", nullable = true, length = 15)
	private String folioSIF;
	@Column(name = "df_solicitud", nullable = true)
	private LocalDate fechaSolicitud;
	@Column(name = "dh_solicitud", nullable = true)
	private LocalTime dhSolicitud;
	@Column(name = "df_autorizacion", nullable = true)
	private LocalDate fechaAutorizacion;
	@Column(name = "ix_monto_aplicacion", nullable = true, precision = 2)
	private Double montoAplicacion;
	@Column(name = "cx_justificacion", nullable = true, length = 1000)
	private String justificacion;
	@Column(name = "cx_objetivo", nullable = true, length = 1000)
	private String objetivo;
	@Column(name = "ix_folio_secuencia", nullable = true)
    private Integer ixFolioSecuencia;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_direccion", referencedColumnName = "id_catalogo", nullable = true)
	private MasterCatalogo direccionCatalogo;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_unidad", referencedColumnName = "id_catalogo", nullable = true)
	private MasterCatalogo unidadCatalogo;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_anhio", referencedColumnName = "id_anhio")
	private AnhoPlaneacion anhioCatalogo;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_adecuacion", referencedColumnName = "id_catalogo", nullable = true)
	private MasterCatalogo adecuacionCatalogo;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_modificacion", referencedColumnName = "id_catalogo", nullable = true)
	private MasterCatalogo modificacionCatalogo;
	@ManyToOne
	@JoinColumn(name = "id_catalogo_estatus", referencedColumnName = "id_catalogo", nullable = false)
	private MasterCatalogo estatusCatalogo;
	@ManyToOne
	@JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", nullable = true)
	private Usuario usuario;
	
	@OneToMany(mappedBy = "solicitud")
	private List<MehSolicitud> hSolicitud = new ArrayList<>();
	@OneToMany(mappedBy = "solicitud")
	private List<AdecuacionSolicitud> adecuaciones = new ArrayList<>();
	
	@Column(name = "cx_uuid", nullable = true, length = 32)
	private String cxUUID;
	
	@ManyToOne
	@JoinColumn(name = "id_estatus_planeacion", referencedColumnName = "id_catalogo", nullable = true)
	private MasterCatalogo estatusPlaneacionCatalogo;

	@Override
	public final boolean equals(Object o) {
		if (this == o) return true;
		if (o == null) return false;
		Class<?> oEffectiveClass = o.getClass();
		Class<?> thisEffectiveClass = this.getClass();
		if (thisEffectiveClass != oEffectiveClass) return false;
		Solicitud that = (Solicitud) o;
		return getIdSolicitud() != null && getIdSolicitud().equals(that.getIdSolicitud());
	}

	@Override
	public final int hashCode() {
		return getClass().hashCode();
	}

	public boolean hasChangedIndicators() {
		return adecuaciones.stream().anyMatch(AdecuacionSolicitud::hasChangedIndicators);
	}
}
