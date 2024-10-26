package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_seguimiento_presupuestal")
@Getter @Setter
public class SeguimientoPresupuestal {
  @EmbeddedId
  private SeguimientoPresupuestalPK id;

  @ManyToOne
  @JoinColumn(name = "id_presupuestal", referencedColumnName = "id_presupuestal", nullable = false, updatable = false, insertable = false)
  private ProgramaPresupuestal programaPresupuestal;
  @ManyToOne
  @JoinColumn(name = "id_unidad", referencedColumnName = "id_catalogo", nullable = false, updatable = false, insertable = false)
  private MasterCatalogo unidad;

  @ManyToOne
  @JoinColumn(name = "id_ciclo_presupuestario", referencedColumnName = "id_seguimiento_meta")
  private SeguimientoMeta cicloPresupuestario;
  @ManyToOne
  @JoinColumn(name = "id_ciclo_presupuestario_ajustado", referencedColumnName = "id_seguimiento_meta")
  private SeguimientoMeta cicloPresupuestarioAjustado;

  @ManyToOne
  @JoinColumn(name = "id_otra_meta", referencedColumnName = "id_seguimiento_meta")
  private SeguimientoMeta otraMeta;
  @ManyToOne
  @JoinColumn(name = "id_otra_meta_ajustada", referencedColumnName = "id_seguimiento_meta")
  private SeguimientoMeta otraMetaAjustada;

  @ManyToOne
  @JoinColumn(name = "id_seguimiento_indicador", referencedColumnName = "id_seguimiento_indicador")
  private SeguimientoIndicador seguimientoIndicador;
}
