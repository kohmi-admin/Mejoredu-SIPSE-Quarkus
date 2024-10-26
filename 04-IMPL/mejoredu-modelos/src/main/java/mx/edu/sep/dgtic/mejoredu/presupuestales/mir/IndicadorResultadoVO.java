package mx.edu.sep.dgtic.mejoredu.presupuestales.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IndicadorResultadoVO extends IndicadorResultadoRegistro {
    private Integer idIndicador;
    private Integer idFichaIndicador;
}
