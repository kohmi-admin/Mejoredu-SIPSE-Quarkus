package mx.edu.sep.dgtic.mejoredu.presupuestales.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaMIRCortoPlazo {
    private Integer idMir;
    private Integer idAnhhio;
    private List<IndicadorResultadoVO> matriz = new ArrayList<>();
    private LocalDateTime fechaCreacion;
}
