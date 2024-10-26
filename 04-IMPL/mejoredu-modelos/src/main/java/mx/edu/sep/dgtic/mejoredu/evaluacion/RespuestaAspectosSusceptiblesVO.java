package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;

import java.time.LocalDate;

@Data
public class RespuestaAspectosSusceptiblesVO {
  private Long idAspectosSusceptibles;
  private Integer anhio;
  private Integer no;
  private Integer idCvePrograma;
  private String cvePrograma;
  private String aspectosSusceptiblesMejora;
  private String actividades;
  private Integer idAreaResponsable;
  private String areaResponsable;
  private LocalDate fechaTermino;
  private String resultadosEsperados;
  private String productosEvidencias;
  private String porcentajeAvance;
  private String observaciones;
  private ArchivoDTO documentoProbatorio;
}
