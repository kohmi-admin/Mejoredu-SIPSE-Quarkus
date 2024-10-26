package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_rubrica")
@Getter @Setter
public class Rubrica {
  @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
  @Column(name = "id_rubrica", unique = true, nullable = false)
  private Integer idRubrica;
  @Column(name = "cd_rubrica", nullable = true)
  private String cdRubrica;
  @Column(name = "cd_estatus", nullable = true)
  private String cdEstatus;
}
