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

public class RespuestaReportePresupuestoDTO {
    private Double presupuestoAsignado;
    private List<PresupuestoUnidadDTO> presupuestoUnidad;
    private List<PresupuestoProyectoDTO> presupuestoProyectos;
}
