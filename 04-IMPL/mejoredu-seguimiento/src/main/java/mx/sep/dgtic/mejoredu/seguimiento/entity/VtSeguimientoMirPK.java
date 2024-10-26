package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class VtSeguimientoMirPK implements Serializable {
  @Column(name = "id_indicador_resultado", nullable = false)
  private Integer idIndicadorResultado;
  @Column(name = "id_producto", nullable = true)
  private Integer idProducto;
  @Column(name = "mes", nullable = true)
  private Integer mes;
}
