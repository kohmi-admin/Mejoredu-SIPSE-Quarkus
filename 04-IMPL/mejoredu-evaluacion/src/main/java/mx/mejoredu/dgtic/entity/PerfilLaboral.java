package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "seg_perfil_laboral")
@Getter @Setter
public class PerfilLaboral {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_perfil_laboral", unique = true, nullable = false)
  private Integer idPerfilLaboral;
  @ManyToOne(optional = true)
  @JoinColumn(name = "id_catalogo_unidad", nullable = true)
  private MasterCatalogo catalogoUnidad;
  @ManyToOne(optional = false)
  @JoinColumn(name = "cve_usuario", nullable = false)
  private Usuario usuario;

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idPerfilLaboral = " + idPerfilLaboral + ")";
  }
}
