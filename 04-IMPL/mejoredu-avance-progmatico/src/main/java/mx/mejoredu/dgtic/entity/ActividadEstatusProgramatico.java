package mx.mejoredu.dgtic.entity;

import lombok.Data;

@Data
public class ActividadEstatusProgramatico {
  private Integer idUnidad;
  private String unidad;
  private String cveUnidad;
  private Integer idActividad;
  private Integer cveActividad;
  private String nombreActividad;
  private Integer idProducto;
  private Integer productosEntregados;
  private Long entregablesProgramados;
  private Long entregablesFinalizados;
  private Double presupuestoProgramado;
  private Double presupuestoUtilizado;
  private Long adecuacionesProductos;
  private Long adecuacionesAcciones;
  private Long adecuacionesPresupuesto;

  public ActividadEstatusProgramatico(
      Integer idUnidad,
      String unidad,
      String cveUnidad,
      Integer idActividad,
      Integer cveActividad,
      String nombreActividad,
      Integer idProducto,
      Integer productosEntregados,
      Long entregablesProgramados,
      Long entregablesFinalizados,
      Double presupuestoProgramado,
      Double presupuestoUtilizado,
      Long adecuacionesProductos,
      Long adecuacionesAcciones,
      Long adecuacionesPresupuesto
  ) {
    this.idUnidad = idUnidad;
    this.unidad = unidad;
    this.cveUnidad = cveUnidad;
    this.idActividad = idActividad;
    this.cveActividad = cveActividad;
    this.nombreActividad = nombreActividad;
    this.idProducto = idProducto;
    this.productosEntregados = productosEntregados;
    this.entregablesProgramados = entregablesProgramados;
    this.entregablesFinalizados = entregablesFinalizados;
    this.presupuestoProgramado = presupuestoProgramado;
    this.presupuestoUtilizado = presupuestoUtilizado;
    this.adecuacionesProductos = adecuacionesProductos;
    this.adecuacionesAcciones = adecuacionesAcciones;
    this.adecuacionesPresupuesto = adecuacionesPresupuesto;
  }
}
