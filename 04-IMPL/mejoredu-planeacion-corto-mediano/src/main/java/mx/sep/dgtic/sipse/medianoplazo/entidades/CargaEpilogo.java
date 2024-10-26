package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@Table(name = "met_mp_carga_pi")
public class CargaEpilogo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_carga_pi", nullable = false)
  private Integer idCarga;
  @Column(name = "cs_estaus")
  private String csEstatus;
  @ManyToOne
  @JoinColumn(name = "id_epilogo", nullable = false, updatable = false, insertable = false)
  private Epilogo epilogo;
  @Column(name = "id_epilogo", nullable = false)
  private Integer idEpilogo;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "id_archivo", nullable = false, insertable = false, updatable = false)
  private Archivo archivo;
  @Column(name = "id_archivo", nullable = false)
  private Integer idArchivo;
  @Column(name = "ix_tipo_archivo")
  private Integer ixTipoDocumento;

  public Integer getIdCarga() {
    return idCarga;
  }

  public void setIdCarga(Integer idCarga) {
    this.idCarga = idCarga;
  }

  public String getCsEstatus() {
    return csEstatus;
  }

  public void setCsEstatus(String csEstatus) {
    this.csEstatus = csEstatus;
  }

  public Epilogo getEpilogo() {
    return epilogo;
  }

  public void setEpilogo(Epilogo epilogo) {
    this.epilogo = epilogo;
  }

  public Integer getIdArchivo() {
    return idArchivo;
  }

  public void setIdArchivo(Integer idArchivo) {
    this.idArchivo = idArchivo;
  }

  public Integer getIxTipoDocumento() {
    return ixTipoDocumento;
  }

  public void setIxTipoDocumento(Integer ixTipoDocumento) {
    this.ixTipoDocumento = ixTipoDocumento;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    CargaEpilogo that = (CargaEpilogo) o;
    return getIdCarga() != null && Objects.equals(getIdCarga(), that.getIdCarga());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "id = " + idCarga + ")";
  }

  public Archivo getArchivo() {
    return archivo;
  }

  public void setArchivo(Archivo archivo) {
    this.archivo = archivo;
  }

  public Integer getIdEpilogo() {
    return idEpilogo;
  }

  public void setIdEpilogo(Integer idEpilogo) {
    this.idEpilogo = idEpilogo;
  }
}
