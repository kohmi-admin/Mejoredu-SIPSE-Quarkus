package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaEvidenciaAutoevaluacionVO;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Timestamp;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "met_evidencia_interna")
@Getter
@Setter
public class EvidenciaInterna {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_evidencia_interna")
  private Long idEvidenciaInterna;
  @Column(name = "id_apartado")
  private Integer idApartado;
  @ManyToOne
  @JoinColumn(name = "id_apartado", referencedColumnName = "id_catalogo", insertable = false, updatable = false)
  private MasterCatalogo apartado;
  @Column(name = "id_anhio")
  private Integer anhio;
  @Column(name = "cx_periodo")
  private Integer periodo;
  @Column(name = "cs_estatus")
  private Character estatus;
  @CreationTimestamp
  @Column(name = "df_registro")
  private Timestamp dfRegistro;
  @ManyToOne
  @JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario")
  private Usuario usuario;
  @ManyToMany
  @JoinTable(name = "met_evidencia_archivo",
      joinColumns = @JoinColumn(name = "id_evidencia_interna"),
      inverseJoinColumns = @JoinColumn(name = "id_archivo"))
  private Set<Archivo> archivos;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    EvidenciaInterna that = (EvidenciaInterna) o;
    return getIdEvidenciaInterna() != null && Objects.equals(getIdEvidenciaInterna(), that.getIdEvidenciaInterna());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idEvidenciaInterna = " + idEvidenciaInterna + ")";
  }

  public RespuestaEvidenciaAutoevaluacionVO toRespuestaEvidenciaAutoevaluacionVO() {
    RespuestaEvidenciaAutoevaluacionVO respuestaEvidenciaAutoevaluacionVO = new RespuestaEvidenciaAutoevaluacionVO();
    respuestaEvidenciaAutoevaluacionVO.setIdEvidencia(idEvidenciaInterna);
    if (apartado != null) {
      respuestaEvidenciaAutoevaluacionVO.setIdApartado(apartado.getIdCatalogo());
      respuestaEvidenciaAutoevaluacionVO.setApartado(apartado.getCdOpcion());
    }
    respuestaEvidenciaAutoevaluacionVO.setFechaRegistro(dfRegistro.toLocalDateTime());
    respuestaEvidenciaAutoevaluacionVO.setAnhio(anhio);
    respuestaEvidenciaAutoevaluacionVO.setPeriodo(periodo);
    respuestaEvidenciaAutoevaluacionVO.setCveUsuario(usuario.getCveUsuario());
    respuestaEvidenciaAutoevaluacionVO.setDocumentos(archivos.stream().map(Archivo::entitieToDTO).toList());
    var perfilLaboral = usuario.getPerfilLaboral().stream().findFirst();
    perfilLaboral.ifPresent(laboral -> respuestaEvidenciaAutoevaluacionVO.setUnidadAdministrativa(laboral.getCatalogoUnidad().getCdOpcion()));
    return respuestaEvidenciaAutoevaluacionVO;
  }
}
