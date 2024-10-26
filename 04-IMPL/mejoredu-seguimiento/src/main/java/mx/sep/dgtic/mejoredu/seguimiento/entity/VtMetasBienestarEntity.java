package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "\"vt_metasBienestar\"")
public class VtMetasBienestarEntity {
	@Id

	@Column(name = "idMeta", nullable = false)
	private int idMeta;

	@Column(name = "cveObjetivo", nullable = false, length = 1)
	private String cveObjetivo;

	@Column(name = "cveMetaPara", nullable = false, length = 3)
	private String cveMetaPara;

	@Column(name = "nomIndicador", nullable = false, length = 40)
	private String nomIndicador;

	@Column(name = "periodicidad", nullable = false, length = 6)
	private String periodicidad;

	@Column(name = "periodicidadOtro", nullable = true)
	private byte[] periodicidadOtro;

	@Column(name = "unidadMedida", nullable = false, length = 10)
	private String unidadMedida;

	@Column(name = "unidadMedidaOtro", nullable = true)
	private byte[] unidadMedidaOtro;

	@Column(name = "tendencia", nullable = false, length = 10)
	private String tendencia;

	@Column(name = "tendenciaOtro", nullable = true)
	private byte[] tendenciaOtro;

	@Column(name = "fuente", nullable = false, length = 8)
	private String fuente;

	@Column(name = "fuenteOtro", nullable = true, length = 45)
	private String fuenteOtro;

	@Column(name = "entregables", nullable = false)
	private long entregables;

	@Column(name = "anhio", nullable = false)
	private int anhio;

	@Column(name = "cveUsuario", nullable = false, length = 45)
	private String cveUsuario;

}
