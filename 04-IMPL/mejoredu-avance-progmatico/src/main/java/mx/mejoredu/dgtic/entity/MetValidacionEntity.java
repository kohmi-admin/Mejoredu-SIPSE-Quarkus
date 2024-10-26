package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Table(name = "met_validacion")
@Getter @Setter
public class MetValidacionEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_validacion")
  private Integer idValidacion;
  @Basic
  @Column(name = "df_validacion")
  private LocalDate dfValidacion;
  @Basic
  @Column(name = "dh_validacion")
  private LocalTime dhValidacion;
  @Column(name = "cve_usuario_registra", nullable = false)
  private String cveUsuarioRegistra;
  @Column(name = "ix_ciclo")
  private Integer ixCiclo;
  @Column(name = "cs_estatus")
  private String csEstatus;
  @Column(name = "cve_usuario_actualiza")
  private String cveUsuarioActualiza;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    MetValidacionEntity that = (MetValidacionEntity) o;
    return Objects.equals(idValidacion, that.idValidacion) && Objects.equals(dfValidacion, that.dfValidacion) && Objects.equals(dhValidacion, that.dhValidacion) && Objects.equals(cveUsuarioRegistra, that.cveUsuarioRegistra) && Objects.equals(ixCiclo, that.ixCiclo) && Objects.equals(csEstatus, that.csEstatus) && Objects.equals(cveUsuarioActualiza, that.cveUsuarioActualiza);
  }

  @Override
  public int hashCode() {
    return Objects.hash(idValidacion, dfValidacion, dhValidacion, cveUsuarioRegistra, ixCiclo, csEstatus, cveUsuarioActualiza);
  }
}
