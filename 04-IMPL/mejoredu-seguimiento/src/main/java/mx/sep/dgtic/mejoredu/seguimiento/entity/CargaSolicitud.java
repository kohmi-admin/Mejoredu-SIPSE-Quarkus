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
@Table(name = "met_carga_solicitud")
public class CargaSolicitud {
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_carga_solicitud", nullable = false)
	private int idCargaSolicitud;
	@Column(name = "cs_estatus_recepcion", nullable = true, length = 1)
	private String csEstatusRecepcion;
	@Column(name = "cs_estatus_transmision", nullable = true, length = 1)
	private String csEstatusTransmision;
	@ManyToOne
	@JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo", nullable = false)
	private Archivo archivo;

}
