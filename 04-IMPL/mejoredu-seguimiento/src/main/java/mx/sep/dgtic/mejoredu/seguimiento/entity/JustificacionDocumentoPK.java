package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class JustificacionDocumentoPK implements Serializable {

	private static final long serialVersionUID = 2545274604384677920L;

	@Column(name = "id_justificacion", nullable = false)
	private Integer idJustificacion;
	@Column(name = "id_archivo", nullable = false)
	private Integer idArchivo;

}
