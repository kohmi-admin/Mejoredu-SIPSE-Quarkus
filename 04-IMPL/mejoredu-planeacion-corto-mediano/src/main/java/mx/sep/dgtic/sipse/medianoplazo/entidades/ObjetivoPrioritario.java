package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "met_mp_objetivo_prioritario")
@Getter @Setter
public class ObjetivoPrioritario {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_objetivo_prioritario", unique = true, nullable = false, precision = 10)
  private Integer idObjetivoPrioritario;

  @Column(name = "id_estructura")
  private Integer idEstrucutra;
  @ManyToOne
  @JoinColumn(name = "id_estructura", insertable = false, updatable = false)
  private Estructura estructura;

  @Column(name = "id_catalogo")
  private Integer idCatalogo;
  @OneToOne
  @JoinColumn(name = "id_catalogo", insertable = false, updatable = false)
  private MasterCatalogo catalogo;
}
