package mx.sep.dgtic.sipse.presupuestal.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

@Entity
@Table(name = "cat_master_catalogo")
@Getter @Setter
public class MasterCatalogo implements Serializable {
  private static final long serialVersionUID = 1L;

  protected static final String PK = "idCatalogo";

  /**
   * The optimistic lock. Available via standard bean get/set operations.
   */
  @Version
  @Column(name = "LOCK_FLAG", nullable = true)
  private Integer lockFlag;

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_catalogo", unique = true, nullable = false, precision = 10)
  private Integer idCatalogo;
  @Getter
  @Column(name = "id_validar", nullable = true)
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion", nullable = true)
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor", nullable = true)
  private Integer idValidacionSupervisor;
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
  @ManyToOne
  @JoinColumn(name = "id_catalogo_padre")
  private MasterCatalogo MasterCatalogo2;
  @Column(name = "ix_dependencia", nullable = true, precision = 10)
  private Integer ixDependencia;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cve_usuario")
  private Usuario usuario;

  /**
   * Compares the key for this instance with another MasterCatalogo.
   *
   * @param other The object to compare to
   * @return True if other object is instance of class MasterCatalogo and the key objects are equal
   */
  private boolean equalKeys(Object other) {
    if (this == other) {
      return true;
    }
    if (!(other instanceof MasterCatalogo)) {
      return false;
    }
    MasterCatalogo that = (MasterCatalogo) other;
    if (this.getIdCatalogo() != that.getIdCatalogo()) {
      return false;
    }
    return true;
  }

  /**
   * Return all elements of the primary key.
   *
   * @return Map of key names to values
   */
  public Map<String, Object> getPrimaryKey() {
    Map<String, Object> ret = new LinkedHashMap<String, Object>(6);
    ret.put("idCatalogo", Integer.valueOf(getIdCatalogo()));
    return ret;
  }

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
