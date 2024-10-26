package mx.edu.sep.dgtic.mejoredu.entidad.planeacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContribucionCatalogo {
	private Integer idCatalogo;
	private Integer idProyecto;
	private Integer tipoContribucion;
	private Integer idSecContribucion;
}
