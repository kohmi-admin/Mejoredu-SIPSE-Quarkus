package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstrategiaDTO {
	private Integer idEstrategia;
	private String cdEstrategia;
	private String cveEstrategia;
	private String usuario;
	private String cveObjetivo;
	private Integer idEstructura;
}
