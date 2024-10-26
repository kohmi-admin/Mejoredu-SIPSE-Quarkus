package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.IdentificacionIndicadorVO;

@Entity
@Table(name = "met_seguimiento_indicador")
@Getter @Setter
public class SeguimientoIndicador {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_seguimiento_indicador", nullable = false)
  private Integer idSeguimientoIndicador;
  @Column(name = "cx_nombre")
  private String cxNombre;
  @Column(name = "cx_definicion")
  private String cxDefinicion;
  @Column(name = "ix_tipo_meta")
  private Integer ixTipoMeta;
  @Column(name = "cx_indicador_pef")
  private Boolean cxIndicadorPef;
  @Column(name = "ix_tipo_formula")
  private Integer ixTipoFormula;
  @Column(name = "cx_tipo_formula_otro")
  private String cxTipoFormulaOtro;
  @Column(name = "ix_estatus")
  private Integer ixEstatus;

  public IdentificacionIndicadorVO toVO() {
    IdentificacionIndicadorVO indicador = new IdentificacionIndicadorVO();
    indicador.setNombre(this.getCxNombre());
    indicador.setDefinicion(this.getCxDefinicion());
    indicador.setIxTipoValorMeta(this.getIxTipoMeta());
    indicador.setIndicadorPEF(this.getCxIndicadorPef());
    indicador.setIxTipoFormula(this.getIxTipoFormula());
    indicador.setTipoFormula(this.getCxTipoFormulaOtro());
    indicador.setIxEstatusAvance(this.getIxEstatus());
    return indicador;
  }
}
