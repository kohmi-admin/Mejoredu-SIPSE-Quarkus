package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SerieHistorica {
	private Integer idMeta;
	private Integer idSerie;
	private String tipo;
	private Integer anhio;
	private String descripcion;
}
