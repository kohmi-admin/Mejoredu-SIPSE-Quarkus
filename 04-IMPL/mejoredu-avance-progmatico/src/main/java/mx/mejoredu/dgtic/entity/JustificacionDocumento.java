package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_justificacion_documentos")
@Getter @Setter
public class JustificacionDocumento {
  @EmbeddedId
  private JustificacionDocumentoPK id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_justificacion", referencedColumnName = "id_justificacion", nullable = false, updatable = false, insertable = false)
  private Justificacion justificacion;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo", nullable = false, updatable = false, insertable = false)
  private Archivo archivo;
}
