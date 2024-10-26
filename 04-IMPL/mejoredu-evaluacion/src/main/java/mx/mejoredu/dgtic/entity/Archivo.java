package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Date;
import java.sql.Time;
import java.util.Objects;

@Entity
@Table(name = "met_archivo")
@Getter @Setter
public class Archivo {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_archivo", unique = true, nullable = false)
  private Integer idArchivo;
  @Column(name = "cx_nombre", length = 45)
  private String nombre;
  @Column(name = "cx_uuid", length = 45)
  private String uuid;
  @Column(name = "cx_uuid_toPDF", length = 45)
  private String uuidToPdf;
  @Column(name = "df_fecha_carga")
  private Date fechaCarga;
  @Column(name = "dh_hora_carga")
  private Time horaCarga;
  @Column(name = "cs_estatus", length = 1)
  private String estatus;
  @Column(name = "id_tipo_documento")
  private Integer idTipoDocumento;
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
    Archivo archivo = (Archivo) o;
    return getIdArchivo() != null && Objects.equals(getIdArchivo(), archivo.getIdArchivo());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idArchivo = " + idArchivo + ")";
  }

  public ArchivoDTO entitieToDTO() {
    ArchivoDTO archivoDTO = new ArchivoDTO();
    if (this.idArchivo != null) {
      archivoDTO.setIdArchivo(this.idArchivo);
      archivoDTO.setCveUsuario(this.usuario.getCveUsuario());
      archivoDTO.setCsEstatus(this.estatus);
      archivoDTO.setCxNombre(this.nombre);
      archivoDTO.setCxUuid(this.uuid);
      archivoDTO.setDfFechaCarga(this.fechaCarga.toLocalDate());
      archivoDTO.setDfHoraCarga(this.horaCarga.toLocalTime());
      archivoDTO.setIdTipoDocumento(this.idTipoDocumento);
    }
    return archivoDTO;
  }
}
