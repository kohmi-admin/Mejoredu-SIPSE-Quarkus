package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_justificacion_documentos")
public class JustificacionDocumento {
	@EmbeddedId
	private JustificacionDocumentoPK id;

	@ManyToOne
	@JoinColumn(name = "id_justificacion", referencedColumnName = "id_justificacion", nullable = false, updatable = false, insertable = false)
	private Justificacion justificacion;
	@ManyToOne
	@JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo", nullable = false, updatable = false, insertable = false)
	private Archivo archivo;
}
