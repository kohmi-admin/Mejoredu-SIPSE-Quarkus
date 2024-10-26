package mx.mejoredu.dgtic.entidades.Respuestas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import mx.mejoredu.dgtic.entidades.vt_producto_sumatiroa;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ListadoSeguimientoReportes {
	private List<vt_producto_sumatiroa> primerTrimestre;
	private List<vt_producto_sumatiroa> segundoTrimestre;
	private List<vt_producto_sumatiroa> tercerTrimestre;
	private List<vt_producto_sumatiroa> cuartoTrimestre;
}
