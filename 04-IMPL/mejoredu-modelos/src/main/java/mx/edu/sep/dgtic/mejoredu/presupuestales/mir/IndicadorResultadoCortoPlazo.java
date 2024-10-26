package mx.edu.sep.dgtic.mejoredu.presupuestales.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IndicadorResultadoCortoPlazo {
    private Integer idIndicador;
    private Integer idIndicadorMP;
    private String tipo;
    private String nivel;
    private String nombreIndicador;
    private Integer metaProgramada;
    private Integer primerTrimestre;
    private Integer segundoTrimestre;
    private Integer tercerTrimestre;
    private Integer cuartoTrimestre;
}
