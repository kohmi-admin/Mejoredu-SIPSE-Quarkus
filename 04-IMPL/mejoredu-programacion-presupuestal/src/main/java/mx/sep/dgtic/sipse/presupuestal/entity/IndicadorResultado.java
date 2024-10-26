package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "met_indicador_resultado")
@Getter @Setter
public class IndicadorResultado {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_indicador_resultado")
  private Integer idIndicadorResultado;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "id_catalogo", referencedColumnName = "id_catalogo", updatable = false, insertable = false)
  private MasterCatalogo masterCatalogo;
  @Column(name = "id_catalogo")
  private Integer idCatalogo;
  @Column(name = "cx_nivel")
  private String cxNivel;
  @Column(name = "cx_clave")
  private String cxClave;
  @Column(name = "cx_resumen")
  private String cxResumen;
  @Column(name = "cx_nombre")
  private String cxNombre;
  @Column(name = "cx_medios")
  private String cxMedios;
  @Column(name = "cx_supuestos")
  private String cxSupuestos;
  @ManyToOne
  @JoinColumn(name = "id_presupuestal", referencedColumnName = "id_presupuestal", updatable = false, insertable = false)
  private ProgramaPresupuestal programaPresupuestal;
  @Column(name = "id_presupuestal")
  private Integer idPresupuestal;
  @ManyToOne
  @JoinColumn(name = "id_ficha_indicadores", referencedColumnName = "id_ficha_indicadores", updatable = false, insertable = false)
  private FichaIndicadores fichaIndicadores;
  @Column(name = "id_ficha_indicadores")
  private Integer idFichaIndicadores;
  @Column(name = "id_validacion")
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion")
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor")
  private Integer idValidacionSupervisor;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    IndicadorResultado that = (IndicadorResultado) o;
    return getIdIndicadorResultado() != null && Objects.equals(getIdIndicadorResultado(), that.getIdIndicadorResultado());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idIndicadorResultado = " + idIndicadorResultado + ")";
  }
}
