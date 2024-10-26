package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoModificacionDTO {
	private Integer idAdecuacionSolicitud;
	private Integer idTipoModificacion;
	private String tipoModificacion;
}
