package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.seguimiento.RespuestaAvancesProgramaticosVO;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "met_avance")
@Getter
@Setter
public class Avance {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  @Column(name = "id_avance", nullable = false)
  private Integer idAvance;
  @Column(name = "ix_tipo_registro", nullable = false)
  private Integer ixTipoRegistro;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_evidencia_mensual", referencedColumnName = "id_evidencia_mensual")
  private EvidenciaMensual evidenciaMensual;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_evidencia_trimestral", referencedColumnName = "id_evidencia_trimestral")
  private EvidenciaTrimestral evidenciaTrimestral;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_prodcal", referencedColumnName = "id_prodcal")
  private ProductoCalendario productoCalendario;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_prodcal_entregado", referencedColumnName = "id_prodcal")
  private ProductoCalendario productoCalendarioEntregado;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_actividad", referencedColumnName = "id_actividad")
  private CortoplazoActividad cortoplazoActividad;
  @Column(name = "ix_cicloValidacion")
  private Integer ixCicloValidacion;
  @Column(name = "id_validacion")
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion")
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor")
  private Integer idValidacionSupervisor;
  @Column(name = "cx_mes")
  private Integer cxMes;
  @Column(name = "cve_usuario")
  private String cveUsuario;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", insertable = false, updatable = false)
  private Usuario usuario;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    Avance avance = (Avance) o;
    return getIdAvance() != null && Objects.equals(getIdAvance(), avance.getIdAvance());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
        "idAvance = " + idAvance + ")";
  }

  public RespuestaAvancesProgramaticosVO toRespuestaAvancesProgramaticosVO() {
    var actividad = productoCalendario != null
        ? productoCalendario.getProducto().getActividad()
        : cortoplazoActividad != null
        ? cortoplazoActividad
        : null;

    RespuestaAvancesProgramaticosVO respuestaAvancesProgramaticosVO = new RespuestaAvancesProgramaticosVO();
    respuestaAvancesProgramaticosVO.setIdAvance(idAvance);
    respuestaAvancesProgramaticosVO.setIdEvidenciaMensual(evidenciaMensual != null ? evidenciaMensual.getIdEvidenciaMensual() : null);
    respuestaAvancesProgramaticosVO.setIdEvidenciaTrimestral(evidenciaTrimestral != null ? evidenciaTrimestral.getIdEvidenciaTrimestral() : null);

    Integer cveProyecto = actividad != null && actividad.getProyecto() != null ? actividad.getProyecto().getCveProyecto() : null;
    String cveProyectoLeftPadded = cveProyecto != null ? String.format("%04d", cveProyecto) : null;

    respuestaAvancesProgramaticosVO.setIdProyecto(actividad != null ? actividad.getIdProyecto() : null);
    respuestaAvancesProgramaticosVO.setCveProyecto(cveProyectoLeftPadded);
    respuestaAvancesProgramaticosVO.setNombreProyecto(actividad != null && actividad.getProyecto() != null ? actividad.getProyecto().getCxNombreProyecto() : null);

    Integer cveActividad = actividad != null ? actividad.getCveActividad() : null;
    String cveActividadLeftPadded = cveActividad != null ? String.format("%03d", cveActividad) : null;

    respuestaAvancesProgramaticosVO.setIdActividad(actividad != null ? actividad.getIdActividad() : null);
    respuestaAvancesProgramaticosVO.setCveActividad(cveActividadLeftPadded);
    respuestaAvancesProgramaticosVO.setNombreActividad(actividad != null ? actividad.getCxNombreActividad() : null);

    respuestaAvancesProgramaticosVO.setIdProducto(productoCalendario != null ? productoCalendario.getIdProducto() : null);
    respuestaAvancesProgramaticosVO.setCveProducto(productoCalendario != null ? productoCalendario.getProducto().getCveProducto() : null);
    respuestaAvancesProgramaticosVO.setNombreProducto(productoCalendario != null ? productoCalendario.getProducto().getCxNombre() : null);
    respuestaAvancesProgramaticosVO.setMes(
        productoCalendario != null
          ? productoCalendario.getCiMes()
          : cxMes != null
            ? cxMes
            : null
    );
    respuestaAvancesProgramaticosVO.setCveUsuario(cveUsuario);
    respuestaAvancesProgramaticosVO.setIxTipoRegistro(ixTipoRegistro);

    return respuestaAvancesProgramaticosVO;
  }
}
