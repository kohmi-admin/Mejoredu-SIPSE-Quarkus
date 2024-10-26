package mx.edu.sep.dgtic.mejoredu.seguimiento.mir;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MirTrimestre {

	private String unidad;
	private Integer programado = 0;
	private Double porcentajeProgramado;
	private Integer reportado = 0;
	private Double porcentajeReportado;

	public void addProgramado(Integer programado) {
		this.programado += programado;
	}

	public void addReportado(Integer reportado) {
		this.reportado += reportado;
	}
}
