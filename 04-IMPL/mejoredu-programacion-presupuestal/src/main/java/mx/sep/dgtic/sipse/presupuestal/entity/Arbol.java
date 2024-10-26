package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
@Entity
@Table(name = "met_arbol")
@Getter @Setter
public class Arbol {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_arbol")
  private Integer idArbol;
  @Column(name = "cx_descripcion")
  private String cxDescripcion;
  @Column(name = "df_fecha_registro")
  @CreationTimestamp
  private Timestamp dfFechaRegistro;
  @Column(name = "ix_tipo")
  private Integer ixTipo;
  @ManyToOne
  @JoinColumn(name = "id_presupuestal", referencedColumnName = "id_presupuestal", updatable = false, insertable = false)
  private ProgramaPresupuestal programaPresupuestal;
  @Column(name = "id_presupuestal")
  private Integer idPresupuestal;
  @OneToMany(mappedBy = "arbol")
  private Set<ArbolNodo> nodos = new HashSet<>();
  @Column(name = "id_validacion")
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion")
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor")
  private Integer idValidacionSupervisor;
  @ManyToOne
  @JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo", updatable = false, insertable = false)
  private Archivo archivo;
  @Column(name = "id_archivo")
  private Integer idArchivo;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Arbol arbol = (Arbol) o;
    return getIdArbol() != null && Objects.equals(getIdArbol(), arbol.getIdArbol());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idArbol = " + idArbol + ")";
  }
}
