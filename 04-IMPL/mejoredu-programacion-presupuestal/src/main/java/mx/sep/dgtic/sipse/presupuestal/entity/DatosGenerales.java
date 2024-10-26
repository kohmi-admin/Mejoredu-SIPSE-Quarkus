package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "met_datosgeneral")
public class DatosGenerales {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_datosgenerales", nullable = false)
  private Integer idDatosGenerales;
  @Column(name = "cx_nombre_programa")
  private String cxNombrePrograma;
  @Column(name = "id_ramo_sector")
  private Integer idRamoSector;
  @Column(name = "id_unidad_responsable")
  private Integer idUnidadResponsable;
  @Column(name = "cx_finalidad")
  private String cxFinalidad;
  @Column(name = "cx_funcion")
  private String cxFuncion;
  @Column(name = "cx_subfuncion")
  private String cxSubfuncion;
  @Column(name = "cx_actividad_institucional")
  private String cxActividadInstitucional;
  @Column(name = "df_fecha_registro")
  @CreationTimestamp
  private LocalDate dfFechaRegistro;
  @Column(name = "id_vinculacion_ods")
  private Integer idVinculacionODS;
  @OneToOne
  @JoinColumn(name = "id_presupuestal", referencedColumnName = "id_presupuestal", updatable = false, insertable = false)
  private ProgramaPresupuestal programaPresupuestal;
  @Column(name = "id_presupuestal")
  private Integer idPresupuestal;

  @Column(name = "id_validacion")
  private Integer idValidacion;
  @Column(name = "id_validacion_planeacion")
  private Integer idValidacionPlaneacion;
  @Column(name = "id_validacion_supervisor")
  private Integer idValidacionSupervisor;
}
