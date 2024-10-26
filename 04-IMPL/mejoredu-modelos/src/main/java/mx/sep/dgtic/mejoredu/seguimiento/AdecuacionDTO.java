package mx.sep.dgtic.mejoredu.seguimiento;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdecuacionDTO {

	private Integer idTipoApartado;
	private String tipoApartado;
	private List<TipoModificacionDTO> tiposModificaciones = new ArrayList<>();

}
