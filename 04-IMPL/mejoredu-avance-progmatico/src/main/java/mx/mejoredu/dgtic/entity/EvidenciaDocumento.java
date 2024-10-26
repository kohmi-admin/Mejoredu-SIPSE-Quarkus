package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_evidencia_documento")
@Getter @Setter
public class EvidenciaDocumento {
	@EmbeddedId
	private EvidenciaDocumentoPK id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_evidencia_mensual", referencedColumnName = "id_evidencia_mensual", nullable = false, updatable = false, insertable = false)
	private EvidenciaMensual evidenciaMensual;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo", nullable = false, updatable = false, insertable = false)
	private Archivo archivo;

}
