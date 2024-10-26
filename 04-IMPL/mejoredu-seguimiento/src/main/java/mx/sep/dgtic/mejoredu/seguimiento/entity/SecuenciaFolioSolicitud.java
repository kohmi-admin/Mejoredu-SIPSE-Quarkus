package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity(name="vt_secuencia_folioSolicitud")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class SecuenciaFolioSolicitud {
	@Id
	@Column(name="id", nullable = false)
	private Integer id;
	@Column(name="secuencia")
	private Integer secuencia;
	@ManyToOne
	@JoinColumn(name="id_catalogo_unidad")
	private MasterCatalogo catalogoUnidad;
}