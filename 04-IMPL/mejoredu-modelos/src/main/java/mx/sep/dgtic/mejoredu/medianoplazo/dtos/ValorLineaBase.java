package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValorLineaBase {
	private Integer idLinea;
	private String valor;
	private Integer anhio;
	private String notas;
	private String meta;
	private String notaSobreMeta;
	private Integer idMeta;
}
