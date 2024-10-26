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

public class RespuestaReporteAdecuacionDTO {
    private Integer totalAdecuados;
    private List<AdecuacionTipo> adecuacionTipos;
    private List<AdecuacionUnidad> adecuacionUnidades;
    private List<AdecuacionProyecto> adecuacionProyectos;
}
