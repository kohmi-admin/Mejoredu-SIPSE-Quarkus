package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class SeguimientoPresupuestalPK implements Serializable {
  @Column(name = "id_presupuestal", nullable = false)
  private Integer idPresupuestal;
  @Column(name = "ix_semestre", nullable = false)
  private Integer ixSemestre;
  @Column(name = "id_unidad", nullable = false)
  private Integer idUnidad;
}
