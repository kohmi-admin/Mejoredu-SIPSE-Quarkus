package mx.sep.dgtic.mejoredu.seguridad;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PeriodosHabilitacionVO {

	private Integer idPeriodoHabilitacion;
	private String modulo;
	private String subModulo;
	private String opcion;
	private LocalDate fechaInicio;
	private LocalDate fechaFin;
	private String estatus;
	private String cveUsuario;

}
