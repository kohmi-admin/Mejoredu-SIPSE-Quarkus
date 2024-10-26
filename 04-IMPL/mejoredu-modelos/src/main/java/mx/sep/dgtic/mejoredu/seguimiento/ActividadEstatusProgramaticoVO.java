package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActividadEstatusProgramaticoVO {
  private Integer idUnidad;
  private String cveUnidad;
  private String unidad;
  private Integer idActividad;
  private Integer cveActividad;
  private String nombreActividad;
  private Double presupuestoProgramado;
  private Double presupuestoUtilizado;
  private Float porcentajePresupuesto;
  private Long totalProductosProgramados;
  private Long totalProductosEntregados;
  private Float porcentajeProductos;
  private Long totalEntregablesProgramados;
  private Long totalEntregablesFinalizados;
  private Float porcentajeEntregables;
  private Long totalAdecuaciones;
}
