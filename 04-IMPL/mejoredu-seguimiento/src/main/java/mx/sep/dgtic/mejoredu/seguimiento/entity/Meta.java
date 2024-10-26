package mx.sep.dgtic.mejoredu.seguimiento.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Entity
@Table(name="met_mp_meta_parametro")
@Getter @Setter
public class Meta {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="id_metas_bienestar", unique=true, nullable=false, precision=10)
  private Integer idMetasBienestar;
  @Column(name="ix_tipo")
  private int ixTipo;
  @Column(name="cx_nombre", length=45)
  private String cxNombre;
  @Column(name="cx_meta", length=45)
  private String cxMeta;
  @Column(name="cx_periodicidad", length=45)
  private String cxPeriodicidad;
  @Column(name="cx_unidad_medida", length=45)
  private String cxUnidadMedida;
  @Column(name="cx_tendencia_esperada", length=45)
  private String cxTendenciaEsperada;
  @Column(name="cx_fuente_variable_uno", length=45)
  private String cxFuenteVariableUno;
  @Column(name="cs_estatus", length=1)
  private String csEstatus;
  @OneToMany(mappedBy="meta", cascade = CascadeType.ALL)
  private List<Elemento> elemento;
  @ManyToOne(optional=false)
  @JoinColumn(name="cve_usuario", nullable=false)
  private Usuario segUsuario;
  @Column(name = "id_validacion", nullable = true)
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion", nullable = true)
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor", nullable = true)
  private Integer idValidacionSupervisor;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Meta meta = (Meta) o;
    return getIdMetasBienestar() != null && Objects.equals(getIdMetasBienestar(), meta.getIdMetasBienestar());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idMetasBienestar = " + idMetasBienestar + ")";
  }
}
