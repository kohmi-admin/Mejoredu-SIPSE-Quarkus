package mx.mejoredu.dgtic.entity;

import lombok.Data;

@Data
public class ProyectosEstatusProgramatico {
  private Integer idProyecto;
  private Integer idAnhio;
  private Integer idUnidad;
  private String cveUnidad;
  private String cveUnidadExterna;
  private Integer cveProyecto;
  private String nombreProyecto;
  private Long adecuacionesProyecto;
  private Integer idActividad;
  private Long adecuacionesActividad;
  private Integer idProducto;
  private Integer productosEntregados;
  private Long entregablesProgramados;
  private Long entregablesFinalizados;
  private Double presupuestoProgramado;
  private Double presupuestoUtilizado;
  private Long adecuacionesAcciones;
  private Long adecuacionesPresupuesto;

  public ProyectosEstatusProgramatico(
      Integer idProyecto,
      Integer idAnhio,
      Integer idUnidad,
      String cveUnidad,
      String cveUnidadExterna,
      Integer cveProyecto,
      String nombreProyecto,
      Long adecuacionesProyecto,
      Integer idActividad,
      Long adecuacionesActividad,
      Integer idProducto,
      Integer productosEntregados,
      Long entregablesProgramados,
      Long entregablesFinalizados,
      Double presupuestoProgramado,
      Double presupuestoUtilizado,
      Long adecuacionesAcciones,
      Long adecuacionesPresupuesto
  ) {
    this.idProyecto = idProyecto;
    this.idAnhio = idAnhio;
    this.idUnidad = idUnidad;
    this.cveUnidad = cveUnidad;
    this.cveUnidadExterna = cveUnidadExterna;
    this.cveProyecto = cveProyecto;
    this.nombreProyecto = nombreProyecto;
    this.adecuacionesProyecto = adecuacionesProyecto;
    this.idActividad = idActividad;
    this.adecuacionesActividad = adecuacionesActividad;
    this.idProducto = idProducto;
    this.productosEntregados = productosEntregados;
    this.entregablesProgramados = entregablesProgramados;
    this.entregablesFinalizados = entregablesFinalizados;
    this.presupuestoProgramado = presupuestoProgramado;
    this.presupuestoUtilizado = presupuestoUtilizado;
    this.adecuacionesAcciones = adecuacionesAcciones;
    this.adecuacionesPresupuesto = adecuacionesPresupuesto;
  }
}
