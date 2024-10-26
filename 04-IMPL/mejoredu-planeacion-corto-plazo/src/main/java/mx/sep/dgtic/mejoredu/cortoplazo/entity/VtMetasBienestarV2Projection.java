package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Getter;
import lombok.Setter;

@RegisterForReflection
@Getter @Setter
public class VtMetasBienestarV2Projection {
  private Integer idElemento;
  private Integer idIndicadorPi;
  private String cveObjetivo;
  private String periodicidad;
  private String periodicidadOtro;
  private String unidadMedida;
  private String unidadMedidaOtro;
  private String tendencia;
  private String indicador;
  private Long entregables;

  public VtMetasBienestarV2Projection(Integer idElemento, Integer idIndicadorPi, String cveObjetivo, String periodicidad, String periodicidadOtro, String unidadMedida, String unidadMedidaOtro, String tendencia, String indicador, Long entregables) {
    this.idElemento = idElemento;
    this.idIndicadorPi = idIndicadorPi;
    this.cveObjetivo = cveObjetivo;
    this.periodicidad = periodicidad;
    this.periodicidadOtro = periodicidadOtro;
    this.unidadMedida = unidadMedida;
    this.unidadMedidaOtro = unidadMedidaOtro;
    this.tendencia = tendencia;
    this.indicador = indicador;
    this.entregables = entregables;
  }
}
