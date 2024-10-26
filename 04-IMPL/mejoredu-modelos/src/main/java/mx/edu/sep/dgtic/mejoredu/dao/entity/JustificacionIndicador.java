package mx.edu.sep.dgtic.mejoredu.dao.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_justificacion_indicador")
@Getter @Setter
public class JustificacionIndicador {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="id_justificacion_indicador")
  private Integer id;
  @Column(name="cx_causas")
  private String causas;
  @Column(name="cx_efectos")
  private String efectos;
  @Column(name="cx_otros_motivos")
  private String otrosMotivos;
}
