package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Table(name = "met_archivo")
public class Archivo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_archivo", nullable = false)
  private Integer idArchivo;
  @Column(name = "cx_nombre")
  private String cxNombre;
  @Column(name = "cx_uuid", nullable = false)
  private String cxUuid;
  @Column(name = "id_tipo_documento", nullable = false)
  private Integer idTipoDocumento;
  @Column(name = "df_fecha_carga", nullable = false)
  private LocalDate dfFechaCarga;
  @Column(name = "dh_hora_carga", nullable = false)
  private LocalTime dhHoraCarga;
  @Column(name = "cs_estatus", nullable = false)
  private String csEstatus;
  @Column(name = "cve_usuario", nullable = false)
  private String cveUsuario;
  @Column(name = "cx_uuid_toPDF")
  private String cxUuidToPdf;

  public Integer getIdArchivo() {
    return idArchivo;
  }

  public void setIdArchivo(Integer idArchivo) {
    this.idArchivo = idArchivo;
  }

  public String getCxNombre() {
    return cxNombre;
  }

  public void setCxNombre(String cxNombre) {
    this.cxNombre = cxNombre;
  }

  public String getCxUuid() {
    return cxUuid;
  }

  public void setCxUuid(String cxUuid) {
    this.cxUuid = cxUuid;
  }

  public Integer getIdTipoDocumento() {
    return idTipoDocumento;
  }

  public void setIdTipoDocumento(Integer idTipoDocumento) {
    this.idTipoDocumento = idTipoDocumento;
  }

  public LocalDate getDfFechaCarga() {
    return dfFechaCarga;
  }

  public void setDfFechaCarga(LocalDate dfFechaCarga) {
    this.dfFechaCarga = dfFechaCarga;
  }

  public LocalTime getDhHoraCarga() {
    return dhHoraCarga;
  }

  public void setDhHoraCarga(LocalTime dhHoraCarga) {
    this.dhHoraCarga = dhHoraCarga;
  }

  public String getCsEstatus() {
    return csEstatus;
  }

  public void setCsEstatus(String csEstatus) {
    this.csEstatus = csEstatus;
  }

  public String getCveUsuario() {
    return cveUsuario;
  }

  public void setCveUsuario(String cveUsuario) {
    this.cveUsuario = cveUsuario;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    Archivo archivo = (Archivo) o;
    return getIdArchivo() != null && Objects.equals(getIdArchivo(), archivo.getIdArchivo());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idArchivo = " + idArchivo + ")";
  }

  public String getCxUuidToPdf() {
    return cxUuidToPdf;
  }

  public void setCxUuidToPdf(String cxUuidToPdf) {
    this.cxUuidToPdf = cxUuidToPdf;
  }
}
