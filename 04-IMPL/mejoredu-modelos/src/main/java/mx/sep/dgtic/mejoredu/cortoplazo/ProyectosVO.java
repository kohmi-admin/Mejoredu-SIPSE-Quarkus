package mx.sep.dgtic.mejoredu.cortoplazo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProyectosVO {
    private Integer idProyecto;
    private Integer cveProyecto;
    private String nombreProyecto;
    private String objetivo;
    private String estatus;
    private Integer anhio;
    private String cveUnidad;
    private List<ActividadVistaGeneralVO> actividades;
//    private List<String> cveProgramaInstitucional;

}
