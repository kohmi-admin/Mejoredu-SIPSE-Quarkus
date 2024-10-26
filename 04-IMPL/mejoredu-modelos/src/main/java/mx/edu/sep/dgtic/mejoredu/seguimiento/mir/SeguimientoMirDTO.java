package mx.edu.sep.dgtic.mejoredu.seguimiento.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeguimientoMirDTO {

	private Integer idIndicadorResultado;
	private String nivel;
	private Long idCatalogoUnidad;
	private String indicador;
	private MirTrimestre primero = new MirTrimestre();
	private MirTrimestre segundo = new MirTrimestre();
	private MirTrimestre tercero = new MirTrimestre();
	private MirTrimestre cuarto = new MirTrimestre();
	private Integer alcanzadoAcumulado;
	private Double porcentajeAcumulado;
	private String estatus;
}
