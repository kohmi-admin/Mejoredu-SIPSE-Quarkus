package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaEncuentaVO;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_evaluacion_consulta")
@Getter @Setter
public class EvaluacionConsulta {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_evaluacion_consulta")
  private Long idEvaluacionConsulta;
  @Column(name = "id_anhio")
  private Integer anhio;
  @Column(name = "cx_area_responsable")
  private String areaResponsable;
  @Column(name = "cx_tipo_instrumento")
  private String tipoInstrumento;
  @Column(name = "cx_nombre_instrumento")
  private String nombreInstrumento;
  @Column(name = "cx_objetivo")
  private String objetivo;
  @Column(name = "cs_estatus")
  private Character estatus;
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
    EvaluacionConsulta that = (EvaluacionConsulta) o;
    return getIdEvaluacionConsulta() != null && Objects.equals(getIdEvaluacionConsulta(), that.getIdEvaluacionConsulta());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idEvaluacionConsulta = " + idEvaluacionConsulta + ")";
  }

  public RespuestaEncuentaVO toRespuestaEncuentaVO() {
    RespuestaEncuentaVO respuesta = new RespuestaEncuentaVO();
    respuesta.setIdEncuesta(this.idEvaluacionConsulta);
    respuesta.setAnhio(this.anhio);
    respuesta.setAreaResponsable(this.areaResponsable);
    respuesta.setTipoInstrumento(this.tipoInstrumento);
    respuesta.setNombreInstrumento(this.nombreInstrumento);
    respuesta.setObjetivo(this.objetivo);
    if (this.archivo != null)
      respuesta.setDocumentoZip(this.archivo.entitieToDTO());
    return respuesta;
  }
}
