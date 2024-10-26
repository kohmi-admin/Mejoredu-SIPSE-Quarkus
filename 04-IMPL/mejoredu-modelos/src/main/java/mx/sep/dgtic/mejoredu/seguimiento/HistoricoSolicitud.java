package mx.sep.dgtic.mejoredu.seguimiento;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class HistoricoSolicitud {
	private Integer idHistorico;
	private LocalDate dfSolicitud;
	private LocalTime dhSolicitud;
	private String usuario;
	private Integer idSolicitud;
	private Integer idEstatus;
}
