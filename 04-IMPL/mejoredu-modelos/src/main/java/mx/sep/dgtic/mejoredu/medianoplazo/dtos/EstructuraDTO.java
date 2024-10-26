package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstructuraDTO {
	private Integer idEstructura;
	private ElementoDTO elemento;
	private AplicacionMetodoDTO aplicacionMetodo;
	private ValorLineaBase valorLineaBase;
	private SerieHistorica serieHistorica;
	private MetasIntermedias metasIntermedias;
}
