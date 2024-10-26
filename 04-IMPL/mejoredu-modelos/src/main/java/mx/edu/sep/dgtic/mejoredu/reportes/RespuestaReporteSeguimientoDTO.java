package mx.edu.sep.dgtic.mejoredu.reportes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode

public class RespuestaReporteSeguimientoDTO {
    private Integer totalProductosCumplidos;
    private Integer totalProductosCancelados;
    private List<SeguimientoSemestre> primerTrimestre;
    private List<SeguimientoSemestre> segundoTrimestre;
    private List<SeguimientoSemestre> tercerTrimestre;
    private List<SeguimientoSemestre> cuartoTrimestre;
}
