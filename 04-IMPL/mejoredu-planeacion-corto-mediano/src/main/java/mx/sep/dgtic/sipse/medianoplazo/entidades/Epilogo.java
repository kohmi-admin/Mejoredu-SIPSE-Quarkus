package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "met_mp_epilogo")
public class Epilogo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_epilogo", nullable = false)
  private Integer idEpilogo;
  @Column(name = "cx_descripcion")
  private String cxDescripcion;
  @Column(name = "cs_estatus")
  private String csEstatus;
  @Column(name = "id_estructura", nullable = false)
  private Integer idEstructura;
  @ManyToOne
  @JoinColumn(name = "id_estructura", insertable = false, updatable = false)
  private Estructura estructura;

  @Column(name = "id_validacion", nullable = true)
  private Integer idValidacion;

  @Column(name = "id_validacion_planeacion", nullable = true)
  private Integer idValidacionPlaneacion;

  @Column(name = "id_validacion_supervisor", nullable = true)
  private Integer idValidacionSupervisor;

  public Integer getIdValidacion() {
    return idValidacion;
  }

  public void setIdValidacion(Integer idValidacion) {
    this.idValidacion = idValidacion;
  }

  public Integer getIdValidacionPlaneacion() {
    return idValidacionPlaneacion;
  }

  public void setIdValidacionPlaneacion(Integer idValidacionPlaneacion) {
    this.idValidacionPlaneacion = idValidacionPlaneacion;
  }

  public Integer getIdValidacionSupervisor() {
    return idValidacionSupervisor;
  }

  public void setIdValidacionSupervisor(Integer idValidacionSupervisor) {
    this.idValidacionSupervisor = idValidacionSupervisor;
  }

  @OneToMany(mappedBy = "epilogo", cascade = CascadeType.ALL)
  private Set<CargaEpilogo> cargaEpilogos = new HashSet<>();

  public Integer getIdEpilogo() {
    return idEpilogo;
  }

  public void setIdEpilogo(Integer idEpilogo) {
    this.idEpilogo = idEpilogo;
  }

  public String getCxDescripcion() {
    return cxDescripcion;
  }

  public void setCxDescripcion(String cxDescripcion) {
    this.cxDescripcion = cxDescripcion;
  }

  public String getCsEstatus() {
    return csEstatus;
  }

  public void setCsEstatus(String csEstatus) {
    this.csEstatus = csEstatus;
  }

  public Integer getIdEstructura() {
    return idEstructura;
  }

  public void setIdEstructura(Integer idEstructura) {
    this.idEstructura = idEstructura;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
    Epilogo epilogo = (Epilogo) o;
    return getIdEpilogo() != null && Objects.equals(getIdEpilogo(), epilogo.getIdEpilogo());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idEpilogo = " + idEpilogo + ")";
  }

  public Set<CargaEpilogo> getCargaEpilogos() {
    return cargaEpilogos;
  }

  public void setCargaEpilogos(Set<CargaEpilogo> cargaEpilogos) {
    this.cargaEpilogos = cargaEpilogos;
  }

  public void addCargaEpilogo(CargaEpilogo cargaEpilogo) {
    this.cargaEpilogos.add(cargaEpilogo);
    cargaEpilogo.setIdEpilogo(this.idEpilogo);
  }
}
