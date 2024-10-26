package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FormularioEvidenciaVO {
  private String dificultad;

  private Boolean revisado;
  private LocalDate fechaSesion;
  private String aprobado;
  private LocalDate fechaAprobacion;

  private Boolean publicacion;
  private Integer tipoPublicacion;
  private String especificarPublicacion;

  private Boolean difusion;
  private Integer tipoDifusion;
  private String especificarDifusion;
}
