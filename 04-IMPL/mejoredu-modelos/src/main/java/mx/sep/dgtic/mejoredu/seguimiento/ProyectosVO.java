package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProyectosVO {
    private Integer idProyecto;
    private String nombreProyecto;
    private String objetivo;
    private List<ActividadVistaGeneralVO> actividades;

}
