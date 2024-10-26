package mx.sep.dgtic.mejoredu.seguimiento;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComentarioSolicitudDTO {

	private Integer idComentario;
	private String comentario;
	private String usuario;
	private Integer idSolicitud;
	private LocalDate dfSeguimiento;
	private LocalTime dhSeguimiento;
}
