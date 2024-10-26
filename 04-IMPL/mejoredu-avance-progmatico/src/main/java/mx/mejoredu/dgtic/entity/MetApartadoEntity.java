package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Table(name = "met_apartado")
@Getter @Setter
public class MetApartadoEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_apartado", nullable = false)
  private Integer idApartado;
  @Column(name = "cx_nombre", nullable = true)
  private String cxNombre;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    MetApartadoEntity that = (MetApartadoEntity) o;
    return Objects.equals(idApartado, that.idApartado) && Objects.equals(cxNombre, that.cxNombre);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idApartado, cxNombre);
  }
}
