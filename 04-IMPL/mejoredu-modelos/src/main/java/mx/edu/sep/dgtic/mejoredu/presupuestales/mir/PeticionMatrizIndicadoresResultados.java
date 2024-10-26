package mx.edu.sep.dgtic.mejoredu.presupuestales.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionMatrizIndicadoresResultados {
    private Integer idAnhio;
    private List<IndicadorResultadoVO> matriz = new ArrayList<>();
}
