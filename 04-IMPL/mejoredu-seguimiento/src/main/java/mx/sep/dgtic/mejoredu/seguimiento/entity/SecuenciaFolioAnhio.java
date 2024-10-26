package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity(name="vt_secuencia_solicitud_anhio")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class SecuenciaFolioAnhio {
	@Id
	@Column(name="id_secuencia", nullable = false)
	private Integer id;
	@Column(name="ix_secuencia")
	private Integer secuencia;
	@Column(name="id_anhio")
	private Integer idAnhio;
}
