package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaReporteMedianoPlazo {
  private Integer idEstructura;
  private String nombrePrograma;
  private String analisis;
  private String problemasPublicos;
  private String epilogo;

  private List<MetaReporte> metasBienestar;
  private List<MetaReporte> parametros;

  private List<ObjetivoEstrategia> objetivos;
}
