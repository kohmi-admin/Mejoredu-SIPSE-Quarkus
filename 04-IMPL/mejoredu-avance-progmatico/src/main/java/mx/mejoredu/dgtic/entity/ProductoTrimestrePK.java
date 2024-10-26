package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Data
@Embeddable
public class ProductoTrimestrePK implements Serializable {
  @Column(name = "id_producto", nullable = false)
  private Integer idProducto;
  @Column(name = "ix_trimestre", nullable = false)
  private Integer ixTrimestre;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ProductoTrimestrePK that = (ProductoTrimestrePK) o;
    return Objects.equals(idProducto, that.idProducto) && Objects.equals(ixTrimestre, that.ixTrimestre);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idProducto, ixTrimestre);
  }
}
