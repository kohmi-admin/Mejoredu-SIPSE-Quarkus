package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaEvaluacionVO;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_desempenhio_interno")
@Getter @Setter
public class DesempenhioInterno {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_desempenhio_interno")
  private Long idDesempenhioInterno;
  @Column(name = "id_anhio")
  private Integer anhio;
  @Column(name = "cx_actor")
  private String actor;
  @Column(name = "cx_nombre_evaluacion")
  private String nombreEvaluacion;
  @Column(name = "cx_tipo_informe")
  private String tipoInforme;
  @Column(name = "cx_observaciones")
  private String observaciones;
  @Column(name = "cx_atencion_observaciones")
  private String atencionObservaciones;
  @Column(name = "cs_estatus")
  private Character estatus;
  @ManyToOne
  @JoinColumn(name = "id_archivo", referencedColumnName = "id_archivo", nullable = false)
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
    DesempenhioInterno that = (DesempenhioInterno) o;
    return getIdDesempenhioInterno() != null && Objects.equals(getIdDesempenhioInterno(), that.getIdDesempenhioInterno());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idDesempenhioInterno = " + idDesempenhioInterno + ")";
  }

  public RespuestaEvaluacionVO toRespuestaEvaluacionVO() {
    RespuestaEvaluacionVO respuesta = new RespuestaEvaluacionVO();
    respuesta.setIdEvaluacion(getIdDesempenhioInterno());
    respuesta.setAnhio(getAnhio());
    respuesta.setActor(getActor());
    respuesta.setNombreEvaluacion(getNombreEvaluacion());
    respuesta.setTipoInforme(getTipoInforme());
    respuesta.setObservaciones(getObservaciones());
    respuesta.setAtencionObservaciones(getAtencionObservaciones());
    if (getArchivo() != null) {
      respuesta.setDocumentoZip(getArchivo().entitieToDTO());
    }
    return respuesta;
  }
}
