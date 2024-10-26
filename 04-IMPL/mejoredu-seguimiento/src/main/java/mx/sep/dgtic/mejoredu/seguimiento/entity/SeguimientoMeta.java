package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.CicloPresupuestarioAjustadoBaseVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.CicloPresupuestarioAjustadoVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.CicloPresupuestarioVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.mirfid.MetaCicloVO;

@Entity
@Table(name = "met_seguimiento_meta")
@Getter @Setter
public class SeguimientoMeta {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_seguimiento_meta", nullable = false)
  private Integer idSeguimientoMeta;
  @Column(name = "ix_tipo_meta")
  private Integer ixTipoMeta;
  @Column(name = "cx_meta_esperada")
  private Float cxMetaEsperada;
  @Column(name = "cx_numerador")
  private Float cxNumerador;
  @Column(name = "cx_denominador")
  private Float cxDenominador;
  @Column(name = "cx_indicador")
  private Float cxIndicador;
  @Column(name = "cx_tipo_ajuste")
  private String cxTipoAjuste;
  @Column(name = "cx_justificacion_causas")
  private String cxJustificacionCausas;
  @Column(name = "cx_justificacion_motivos")
  private String cxJustificacionMotivos;
  @Column(name = "cx_justificacion_otros")
  private String cxJustificacionOtros;

  public CicloPresupuestarioVO toCicloPresupuestario() {
    var cicloPresupuestario = new CicloPresupuestarioVO();

    cicloPresupuestario.setMeta(this.getCxMetaEsperada());
    cicloPresupuestario.setNumerador(this.getCxNumerador());
    cicloPresupuestario.setDenominador(this.getCxDenominador());
    cicloPresupuestario.setIndicador(this.getCxIndicador());

    return cicloPresupuestario;
  }

  public CicloPresupuestarioAjustadoVO toCicloPresupuestarioAjustado() {
    var cicloPresupuestarioAjustado = new CicloPresupuestarioAjustadoVO();

    cicloPresupuestarioAjustado.setTipoAjuste(this.getCxTipoAjuste());
    cicloPresupuestarioAjustado.setMeta(this.getCxMetaEsperada());
    cicloPresupuestarioAjustado.setNumerador(this.getCxNumerador());
    cicloPresupuestarioAjustado.setDenominador(this.getCxDenominador());
    cicloPresupuestarioAjustado.setIndicador(this.getCxIndicador());
    cicloPresupuestarioAjustado.setCausas(this.getCxJustificacionCausas());
    cicloPresupuestarioAjustado.setEfectos(this.getCxJustificacionMotivos());
    cicloPresupuestarioAjustado.setOtrosMotivos(this.getCxJustificacionOtros());

    return cicloPresupuestarioAjustado;
  }

  public MetaCicloVO toMetaCiclo() {
    var metaCiclo = new MetaCicloVO();

    metaCiclo.setMeta(this.getCxMetaEsperada());
    metaCiclo.setNumerador(this.getCxNumerador());
    metaCiclo.setIndicador(this.getCxIndicador());

    return metaCiclo;
  }

  public CicloPresupuestarioAjustadoBaseVO toMetaCicloAjustado() {
    var metaCicloAjustado = new CicloPresupuestarioAjustadoBaseVO();

    metaCicloAjustado.setMeta(this.getCxMetaEsperada());
    metaCicloAjustado.setNumerador(this.getCxNumerador());
    metaCicloAjustado.setIndicador(this.getCxIndicador());
    metaCicloAjustado.setTipoAjuste(this.getCxTipoAjuste());

    metaCicloAjustado.setCausas(this.getCxJustificacionCausas());
    metaCicloAjustado.setEfectos(this.getCxJustificacionMotivos());
    metaCicloAjustado.setOtrosMotivos(this.getCxJustificacionOtros());

    return metaCicloAjustado;
  }
}
