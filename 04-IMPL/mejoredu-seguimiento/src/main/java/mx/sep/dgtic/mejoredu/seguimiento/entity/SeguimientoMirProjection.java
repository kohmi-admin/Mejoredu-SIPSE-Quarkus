package mx.sep.dgtic.mejoredu.seguimiento.entity;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;

@Data
@RegisterForReflection
public class SeguimientoMirProjection {

	private Integer idIndicadorResultado;
	private Integer idAnhio;
	private String nivelMir;
	private String indicador;
	private Long idCatalogoUnidad;
	private String unidadCorta;
	private String unidadLarga;
	private Long programado;
	private Long entregado;

	public SeguimientoMirProjection(Integer idIndicadorResultado, Integer idAnhio, String nivelMir,
			String indicador, Long idCatalogoUnidad, String unidadCorta, String unidadLarga, Long programado,
			Long entregado) {
		this.idIndicadorResultado = idIndicadorResultado;
		this.idAnhio = idAnhio;
		this.nivelMir = nivelMir;
		this.indicador = indicador;
		this.idCatalogoUnidad = idCatalogoUnidad;
		this.unidadCorta = unidadCorta;
		this.unidadLarga = unidadLarga;
		this.programado = programado;
		this.entregado = entregado;
	}

}
