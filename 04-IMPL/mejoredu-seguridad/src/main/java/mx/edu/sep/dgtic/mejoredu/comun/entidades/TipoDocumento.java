package mx.edu.sep.dgtic.mejoredu.comun.entidades;

import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "met_tipo_documento")
public class TipoDocumento {
  protected static final String PK = "idTipoDocumento";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_tipo_documento", unique = true, nullable = false)
  private Integer idTipoDocumento;
  @Column(name = "cd_tipo_documento", nullable = false, length = 45)
  private String cdTipoDocumento;
  @Column(name = "cx_extension", nullable = false, length = 45)
  private String cxExtension;
  @Column(name = "cx_tipo_contenido", nullable = false, length = 45)
  private String cxTipoContenido;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    TipoDocumento that = (TipoDocumento) o;

    if (!Objects.equals(idTipoDocumento, that.idTipoDocumento))
      return false;
    if (!Objects.equals(cdTipoDocumento, that.cdTipoDocumento))
      return false;
    if (!Objects.equals(cxExtension, that.cxExtension)) return false;
    return Objects.equals(cxTipoContenido, that.cxTipoContenido);
  }

  @Override
  public int hashCode() {
    int result = idTipoDocumento != null ? idTipoDocumento.hashCode() : 0;
    result = 31 * result + (cdTipoDocumento != null ? cdTipoDocumento.hashCode() : 0);
    result = 31 * result + (cxExtension != null ? cxExtension.hashCode() : 0);
    result = 31 * result + (cxTipoContenido != null ? cxTipoContenido.hashCode() : 0);
    return result;
  }

  @Override
  public String toString() {
    return "TipoDocumento{" +
            "idTipoDocumento=" + idTipoDocumento +
            ", cdTipoDocumento='" + cdTipoDocumento + '\'' +
            ", cxExtension='" + cxExtension + '\'' +
            ", cxTipoContenido='" + cxTipoContenido + '\'' +
            '}';
  }

  public Integer getIdTipoDocumento() {
    return idTipoDocumento;
  }

  public void setIdTipoDocumento(Integer idTipoDocumento) {
    this.idTipoDocumento = idTipoDocumento;
  }

  public String getCdTipoDocumento() {
    return cdTipoDocumento;
  }

  public void setCdTipoDocumento(String cdTipoDocumento) {
    this.cdTipoDocumento = cdTipoDocumento;
  }

  public String getCxExtension() {
    return cxExtension;
  }

  public void setCxExtension(String cxExtension) {
    this.cxExtension = cxExtension;
  }

  public String getCxTipoContenido() {
    return cxTipoContenido;
  }

  public void setCxTipoContenido(String cxTipoContenido) {
    this.cxTipoContenido = cxTipoContenido;
  }
}
