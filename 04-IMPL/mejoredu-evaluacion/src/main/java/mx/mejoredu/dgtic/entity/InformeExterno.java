package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaInformeEvaluacionExternaVO;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_informe_externo")
@Getter @Setter
public class InformeExterno {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_informe_externo")
  private Long idInformeExterno;
  @Column(name = "id_anhio")
  private Integer anhio;
  @Column(name = "cx_tipo_evaluacion")
  private String tipoEvaluacion;
  @Column(name = "cx_nombre_evaluacion")
  private String nombreEvaluacion;
  @Column(name = "cx_tipo_informe")
  private String tipoInforme;
  @Column(name = "cx_posicion_institucional")
  private String posicionInstitucional;
  @Column(name = "cx_aspectos_susceptibles_mejora")
  private String aspectosSusceptiblesMejora;
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
    InformeExterno that = (InformeExterno) o;
    return getIdInformeExterno() != null && Objects.equals(getIdInformeExterno(), that.getIdInformeExterno());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idInformeExterno = " + idInformeExterno + ")";
  }

  public RespuestaInformeEvaluacionExternaVO toRespuestaInformeEvaluacionExternaVO() {
    RespuestaInformeEvaluacionExternaVO respuesta = new RespuestaInformeEvaluacionExternaVO();
    respuesta.setIdInformeExterno(this.idInformeExterno);
    respuesta.setAnhio(this.anhio);
    respuesta.setTipoEvaluacion(this.tipoEvaluacion);
    respuesta.setNombreEvaluacion(this.nombreEvaluacion);
    respuesta.setTipoInforme(this.tipoInforme);
    respuesta.setPosicionInstitucional(this.posicionInstitucional);
    respuesta.setAspectosSusceptiblesMejora(this.aspectosSusceptiblesMejora);
    if (this.archivo != null)
      respuesta.setDocumentoZip(this.archivo.entitieToDTO());
    return respuesta;
  }
}
