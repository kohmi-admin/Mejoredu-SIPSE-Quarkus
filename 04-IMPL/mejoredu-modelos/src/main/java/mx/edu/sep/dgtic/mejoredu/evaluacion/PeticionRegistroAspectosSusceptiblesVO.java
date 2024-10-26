package mx.edu.sep.dgtic.mejoredu.evaluacion;

import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;

@Data
public class PeticionRegistroAspectosSusceptiblesVO {
  private Long idAspectosSusceptibles;
  private String cveUsuario;
  private Integer anhio;
  private Integer no;
  private Integer cvePrograma;
  private String aspectosSusceptiblesMejora;
  private String actividades;
  private Integer idAreaResponsable;
  private String fechaTermino;
  private String resultadosEsperados;
  private String productosEvidencias;
  private String porcentajeAvance;
  private String observaciones;
  private ArchivoBase documentoProbatorio;
}
