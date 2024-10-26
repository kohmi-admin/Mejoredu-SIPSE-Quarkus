package mx.mejoredu.dgtic.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.*;
import lombok.*;

@Data
@Embeddable
public class EvidenciaDocumentoPK implements Serializable {
	@Column(name = "id_evidencia_mensual", nullable = false)
	private Integer idEvidenciaMensual;
	@Column(name = "id_archivo", nullable = false)
	private Integer idArchivo;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		EvidenciaDocumentoPK that = (EvidenciaDocumentoPK) o;
		return Objects.equals(idEvidenciaMensual, that.idEvidenciaMensual) && Objects.equals(idArchivo, that.idArchivo);
	}

	@Override
	public int hashCode() {
		return Objects.hash(idEvidenciaMensual, idArchivo);
	}
}
