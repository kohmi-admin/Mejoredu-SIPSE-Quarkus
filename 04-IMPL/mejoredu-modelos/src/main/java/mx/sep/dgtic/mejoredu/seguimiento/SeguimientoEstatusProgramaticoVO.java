package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Emmanuel Estrada Gonzalez (emmanuel.estrada)
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SeguimientoEstatusProgramaticoVO {
    private Integer idProyecto;
    private Integer claveProyecto;
    private Integer idUnidad;
    private String cveUnidad;
    private String unidad;
    private String proyecto;
    private Double presupuestoProgramado;
    private Double presupuestoUtilizado;
    private Float porcentajePresupuesto;
    private Long totalActividades;
    private Long totalProductosProgramados;
    private Long totalProductosEntregados;
    private Float porcentajeProductos;
    private Long totalEntregablesProgramados;
    private Long totalEntregablesFinalizados;
    private Float porcentajeEntregables;
    private Long totalAdecuaciones;
}
