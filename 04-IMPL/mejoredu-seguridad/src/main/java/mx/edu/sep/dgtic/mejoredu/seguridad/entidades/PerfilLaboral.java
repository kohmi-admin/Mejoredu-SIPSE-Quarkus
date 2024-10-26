// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import jakarta.persistence.*;
import lombok.*;
import mx.edu.sep.dgtic.mejoredu.comun.entidades.Archivo;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "seg_perfil_laboral")
@Getter @Setter
public class PerfilLaboral implements Serializable {

  /**
   * Primary key.
   */
  protected static final String PK = "idPerfilLaboral";
  /**
   *
   */
  @Serial
  private static final long serialVersionUID = 743281368474243931L;
  /**
   * The optimistic lock. Available via standard bean get/set operations.
   */
  @Version
  @Column(name = "LOCK_FLAG")
  private Integer lockFlag;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_perfil_laboral", unique = true, nullable = false, precision = 10)
  private Integer idPerfilLaboral;
  @Column(name = "ci_numero_empleado", precision = 10)
  private int ciNumeroEmpleado;
  @Column(name = "cx_puesto", length = 120)
  private String cxPuesto;
  @Column(name = "cx_telefono_oficina", length = 45)
  private String cxTelefonoOficina;
  @Column(name = "cx_extension", length = 45)
  private String cxExtension;
  @Column(name = "cx_dg_administacion", length = 45)
  private String cxDgAdministacion;
  @Column(name = "cs_status", length = 1)
  private String csStatus;
  @Column(name = "id_catalogo_area", nullable = true)
  private Integer idArea;
  @Column(name = "ix_nivel", nullable = true)
  private Integer idNivel;
  @ManyToOne(optional = true)
  @JoinColumn(name = "id_catalogo_unidad", nullable = true)
  private CatMasterCatalogo catalogoUnidad;
  @ManyToOne(optional = true)
  @JoinColumn(name = "id_catalogo_direccion", nullable = true)
  private CatMasterCatalogo catalogoDireccion;
  @ManyToOne(optional = false)
  @JoinColumn(name = "cve_usuario", nullable = false)
  private Usuario usuario;
  @ManyToOne
  @JoinColumn(name = "id_archivo")
  private Archivo archivoFirma;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    PerfilLaboral that = (PerfilLaboral) o;
    return getIdPerfilLaboral() != null && Objects.equals(getIdPerfilLaboral(), that.getIdPerfilLaboral());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }
}
