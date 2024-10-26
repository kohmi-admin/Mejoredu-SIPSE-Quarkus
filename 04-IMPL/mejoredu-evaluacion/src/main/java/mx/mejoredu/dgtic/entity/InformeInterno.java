package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaInformeAutoevaluacionVO;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_informe_interno")
@Getter @Setter
public class InformeInterno {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_informe_interno")
  private Long idInformeInterno;
  @Column(name = "cx_nombre_informe")
  private String nombreInforme;
  @Column(name = "cx_periodo")
  private Integer periodo;
  @Column(name = "id_anhio")
  private Integer anhio;
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
    InformeInterno that = (InformeInterno) o;
    return getIdInformeInterno() != null && Objects.equals(getIdInformeInterno(), that.getIdInformeInterno());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idInformeInterno = " + idInformeInterno + ")";
  }

  public RespuestaInformeAutoevaluacionVO entitieToRespuestaVO() {
    RespuestaInformeAutoevaluacionVO respuesta = new RespuestaInformeAutoevaluacionVO();
    respuesta.setIdInforme(this.idInformeInterno);
    respuesta.setNombreInforme(this.nombreInforme);
    respuesta.setPeriodo(this.periodo);
    respuesta.setAnhio(this.anhio);
    if (this.archivo != null){
      respuesta.setDocumentoZip(this.archivo.entitieToDTO());
    }
    respuesta.setCveUsuario(this.usuario.getCveUsuario());
    return respuesta;
  }
}
