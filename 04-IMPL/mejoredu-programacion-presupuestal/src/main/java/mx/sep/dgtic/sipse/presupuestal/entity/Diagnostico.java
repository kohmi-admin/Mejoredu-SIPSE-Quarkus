package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "met_diagnostico")
public class Diagnostico {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_diagnostico", nullable = false)
  private Integer idDiagnostico;
  @Column(name = "cx_antecedentes")
  private String cxAntecedentes;
  @Column(name = "cx_definicion_problema")
  private String cxDefinicionProblema;
  @Column(name = "cx_estado_problema")
  private String cxEstadoProblema;
  @Column(name = "cx_evolucion_problema")
  private String cxEvolucionProblema;
  @Column(name = "cx_cobertura")
  private String cxCobertura;
  @Column(name = "cx_identificacion_poblacion_potencial")
  private String cxIdentificacionPoblacionPotencial;
  @Column(name = "cx_identificacion_poblacion_objetivo")
  private String cxIdentificacionPoblacionObjetivo;
  @Column(name = "cx_cuantificacion_poblacion_objetivo")
  private String cxCuantificacionPoblacionObjetivo;
  @Column(name = "cx_frecuencia_actualizacion_potencialobjetivo")
  private String cxFrecuenciaActualizacionPotencialObjetivo;
  @Column(name = "cx_analisis_alternativas")
  private String cxAnalisisAlternativas;
  @Column(name = "df_fecha_registro")
  @CreationTimestamp
  private Timestamp dfFechaRegistro;
  @ManyToOne
  @JoinColumn(name = "id_presupuestal", nullable = false, updatable = false, insertable = false)
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
