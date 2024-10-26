package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_mp_elemento")
@Getter @Setter
public class Elemento {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_elemento", unique = true, nullable = false, precision = 10)
  private Integer idElemento;
  @Column(name = "cx_nombre", length = 90)
  private String cxNombre;
  @ManyToOne(optional = false)
  @JoinColumn(name = "id_catalogo_objetivo", nullable = false)
  private MasterCatalogo objetivo;
  @Column(name = "cx_definicion", length = 120)
  private String cxDefinicion;
  @Column(name = "cx_periodo", length = 120)
  private String cxPeriodo;
  @Column(name = "cx_unidad_medida", length = 120)
  private String cxUnidadMedida;
  @Column(name = "cx_periodo_recoleccion", length = 120)
  private String cxPeriodoRecoleccion;
  @Column(name = "cx_metodo_calculo", length = 120)
  private String cxMetodoCalculo;
  @Column(name = "cx_observacion", length = 120)
  private String cxObservacion;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_nivel_desagregacion")
  private MasterCatalogo nivelDesagregacion;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_unidad_responsable")
  private MasterCatalogo unidadResponsable;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_periodicidad")
  private MasterCatalogo MasterCatalogo2;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_tipo")
  private MasterCatalogo MasterCatalogo3;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_unidad_medida")
  private MasterCatalogo MasterCatalogo4;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_acumulado")
  private MasterCatalogo MasterCatalogo5;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_periodo_recoleccion")
  private MasterCatalogo MasterCatalogo6;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_dimension")
  private MasterCatalogo MasterCatalogo7;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_disponibilidad")
  private MasterCatalogo MasterCatalogo8;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_tendencia")
  private MasterCatalogo MasterCatalogo9;
  @ManyToOne(optional = false)
  @JoinColumn(name = "id_meta", nullable = false)
  private Meta meta;
  @OneToOne(optional = true)
  @JoinColumn(name = "id_catalogo_elemento", referencedColumnName = "id_catalogo", updatable = false, insertable = false)
  private MasterCatalogo catalogoElemento;
  @Column(name = "id_catalogo_elemento")
  private Integer idCatalogoElemento;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Elemento elemento = (Elemento) o;
    return getIdElemento() != null && Objects.equals(getIdElemento(), elemento.getIdElemento());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idElemento = " + idElemento + ")";
  }
}
