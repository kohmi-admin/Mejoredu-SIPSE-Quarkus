package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "met_validacion_rubrica")
@Getter @Setter
public class ValidacionRubrica {
  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  @Column(name = "id_validacion_rubrica", unique = true, nullable = false)
  private Integer idValidacionRubrica;


  @Column(name = "df_registro", nullable = true)
  private LocalDate df_registro;
  @Column(name = "cx_observaciones", nullable = true)
  private String cx_observaciones;
  @Column(name = "ix_puntuacion", nullable = true)
  private Integer ix_puntuacion;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_rubrica", nullable = true)
  private Rubrica rubrica;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_validacion", nullable = true)
  private MetValidacionEntity validacion;
}
