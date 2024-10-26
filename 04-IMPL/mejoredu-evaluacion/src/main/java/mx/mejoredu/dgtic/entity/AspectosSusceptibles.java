package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaAspectosSusceptiblesVO;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Date;
import java.util.Objects;

@Entity
@Table(name = "met_aspectos_susceptibles")
@Getter
@Setter
public class AspectosSusceptibles {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_aspectos_susceptibles")
  private Long idAspectosSusceptibles;
  @Column(name = "id_anhio")
  private Integer anhio;
  @Column(name = "cve_programa")
  private Integer cvePrograma;
  @ManyToOne
  @JoinColumn(name = "cve_programa", referencedColumnName = "id_catalogo", insertable = false, updatable = false)
  private MasterCatalogo programa;
  @Column(name = "cx_aspectos_susceptibles_mejora")
  private String aspectosSusceptiblesMejora;
  @Column(name = "cx_actividades")
  private String actividades;
  @Column(name = "id_area_responsable")
  private Integer idAreaResponsable;
  @ManyToOne
  @JoinColumn(name = "id_area_responsable", referencedColumnName = "id_catalogo", insertable = false, updatable = false)
  private MasterCatalogo areaResponsable;
  @Column(name = "df_fecha_termino")
  private Date fechaTermino;
  @Column(name = "cx_resultados_esperados")
  private String resultadosEsperados;
  @Column(name = "cx_productos_evidencias")
  private String productosEvidencias;
  @Column(name = "cx_porcentaje_avance")
  private String porcentajeAvance;
  @Column(name = "cx_observaciones")
  private String observaciones;
  @Column(name = "cs_estatus")
  private Character estatus;
  @Column(name = "cx_no")
  private Integer no;
  @ManyToOne
  @JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo")
  private Archivo archivo;
  @ManyToOne
  @JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario")
  private Usuario usuario;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    AspectosSusceptibles that = (AspectosSusceptibles) o;
    return getIdAspectosSusceptibles() != null && Objects.equals(getIdAspectosSusceptibles(), that.getIdAspectosSusceptibles());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idAspectosSusceptibles = " + idAspectosSusceptibles + ")";
  }

  public RespuestaAspectosSusceptiblesVO toRespuestaAspectosSusceptiblesVO() {
    RespuestaAspectosSusceptiblesVO respuesta = new RespuestaAspectosSusceptiblesVO();
    respuesta.setIdAspectosSusceptibles(this.idAspectosSusceptibles);
    respuesta.setAnhio(this.anhio);
    if (this.programa != null) {
      respuesta.setIdCvePrograma(this.programa.getIdCatalogo());
      respuesta.setCvePrograma(this.programa.getCdOpcion());
    }
    respuesta.setAspectosSusceptiblesMejora(this.aspectosSusceptiblesMejora);
    respuesta.setActividades(this.actividades);
    if (this.areaResponsable != null) {
      respuesta.setIdAreaResponsable(this.areaResponsable.getIdCatalogo());
      respuesta.setAreaResponsable(this.areaResponsable.getCdOpcion());
    }
    if (this.fechaTermino != null)
      respuesta.setFechaTermino(this.fechaTermino.toLocalDate());
    respuesta.setResultadosEsperados(this.resultadosEsperados);
    respuesta.setProductosEvidencias(this.productosEvidencias);
    respuesta.setPorcentajeAvance(this.porcentajeAvance);
    respuesta.setObservaciones(this.observaciones);
    respuesta.setNo(this.no);
    if (this.archivo != null)
      respuesta.setDocumentoProbatorio(this.archivo.entitieToDTO());
    return respuesta;
  }
}
