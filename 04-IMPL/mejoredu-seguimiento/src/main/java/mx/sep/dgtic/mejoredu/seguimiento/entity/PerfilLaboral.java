// Generated with g9.

package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity(name = "seg_perfil_laboral")
public class PerfilLaboral implements Serializable {

  /**
   *
   */
  private static final long serialVersionUID = 743281368474243931L;

  /**
   * Primary key.
   */
  protected static final String PK = "idPerfilLaboral";

  /**
   * The optimistic lock. Available via standard bean get/set operations.
   */
  @Version
  @Column(name = "LOCK_FLAG")
  private Integer lockFlag;



  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_perfil_laboral", unique = true, nullable = false, precision = 10)
  private int idPerfilLaboral;
  @Column(name = "ci_numero_empleado", precision = 10)
  private int ciNumeroEmpleado;
  @Column(name = "cx_puesto", length = 120)
  private String cxPuesto;
  @Column(name = "cx_telefono_oficina", length = 45)
  private String cxTelefonoOficina;
  @Column(name = "cx_extension", length = 45)
  private String cxExtension;
  @Column(name = "cx_dg_administacion", length = 45)
  private String cxDgAdministacion;
  @Column(name = "cs_status", length = 1)
  private String csStatus;
  @Column(name = "id_catalogo_area", nullable = false)
  private Integer idArea;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_unidad", nullable = true, updatable = false, insertable = false)
  private MasterCatalogo catalogoUnidad;
  @Column(name = "id_catalogo_unidad", nullable = true)
  private Integer idCatalogoUnidad;
  @ManyToOne
  @JoinColumn(name = "id_catalogo_direccion", nullable = true)
  private MasterCatalogo catalogoDireccion;
  @ManyToOne(optional = false)
  @JoinColumn(name = "cve_usuario", nullable = false, updatable = false, insertable = false)
  private Usuario usuario;
  @Column(name = "cve_usuario", nullable = false)
  private String cveUsuario;
  
  @Column(name = "id_archivo", nullable = true)
  private Integer idArchivo;

}
