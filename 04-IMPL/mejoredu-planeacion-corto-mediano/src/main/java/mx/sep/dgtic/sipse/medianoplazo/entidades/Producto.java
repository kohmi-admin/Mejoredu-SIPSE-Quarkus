package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_cortoplazo_producto")
@Getter @Setter
public class Producto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_producto", unique = true, nullable = false)
  private Integer idProducto;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_indicador_pl", updatable = false, insertable = false)
  private MasterCatalogo indicadorPI;
  @Column(name = "id_indicador_pi")
  private Integer idIndicadorPI;
}
