package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccionDTO {
	private Integer idEstrategia;
	private Integer idAccion;
	private String cdAccion;

	private String cveEstrategia;
	private String cveAccion;
	private String usuario;

	private Integer idEstructura;
}
