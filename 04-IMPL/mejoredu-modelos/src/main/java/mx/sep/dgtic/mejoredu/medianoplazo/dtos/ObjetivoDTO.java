package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ObjetivoDTO {
	private Integer idObjetivo;
	private Integer ixObjetivo;
	private String cdObjetivo;
	private String relevancia;
	private String usuario;
	private Integer idEstructura;
}
