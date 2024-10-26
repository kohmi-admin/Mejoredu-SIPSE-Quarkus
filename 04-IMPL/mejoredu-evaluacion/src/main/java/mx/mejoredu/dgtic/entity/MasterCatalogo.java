package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "cat_master_catalogo")
@Getter @Setter
public class MasterCatalogo {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_catalogo")
  private Integer idCatalogo;
  @Column(name = "cd_opcion", nullable = false, length = 500)
  private String cdOpcion;
  @Column(name = "cc_externa", length = 45, nullable = true)
  private String ccExterna;
  @Column(name = "df_baja", nullable = true)
  private LocalDate dfBaja;
  @Column(name = "cd_descripcionDos", length = 500, nullable = true)
  private String cdDescripcionDos;
  @Column(name = "cc_externaDos", length = 45, nullable = true)
  private String ccExternaDos;
  @Column(name = "ix_dependencia", nullable = true, precision = 10)
  private Integer ixDependencia;
  @Column(name = "cve_usuario", nullable = false, length = 45)
  private String cveUsuario;
  @Column(name = "id_validar", nullable = true)
  private Integer idValidar;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_padre", referencedColumnName = "id_catalogo", nullable = true)
  private MasterCatalogo catalogoPadre;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    MasterCatalogo that = (MasterCatalogo) o;
    return getIdCatalogo() != null && Objects.equals(getIdCatalogo(), that.getIdCatalogo());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idCatalogo = " + idCatalogo + ")";
  }
}
