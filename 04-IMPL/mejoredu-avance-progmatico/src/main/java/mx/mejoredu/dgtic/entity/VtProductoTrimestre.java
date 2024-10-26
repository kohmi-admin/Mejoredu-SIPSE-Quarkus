package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

@Entity
@Table(name = "vt_producto_trimestre")
@Immutable
@Getter @Setter
public class VtProductoTrimestre {
  @EmbeddedId
  private ProductoTrimestrePK id;

  @Column(name = "id_actividad")
  private Integer idActividad;
  @ManyToOne
  @JoinColumn(name = "id_actividad", referencedColumnName = "id_actividad", nullable = false, updatable = false, insertable = false)
  private CortoplazoActividad actividad;

  @Column(name = "productosEntregados")
  private Integer productosEntregados;
  @Column(name = "entregablesProgramados")
  private Integer entregablesProgramados;
  @Column(name = "entregablesFinalizados")
  private Integer entregablesFinalizados;
  @Column(name = "presupuesto")
  private Double presupuesto;
  @Column(name = "presupuestoUtilizado")
  private Double presupuestoUtilizado;
  @Column(name = "adecuaciones_acciones")
  private Integer adecuacionesAcciones;
  @Column(name = "adecuaciones_presupuesto")
  private Integer adecuacionesPresupuesto;
}
