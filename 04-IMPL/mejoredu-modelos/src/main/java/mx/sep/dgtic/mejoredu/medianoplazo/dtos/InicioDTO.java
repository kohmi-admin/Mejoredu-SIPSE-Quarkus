package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InicioDTO {
	private Integer idPrograma;
	private String nombrePrograma;
	private Integer alineacionPND;
	private String analisis;
	private String programasPublicos;
	private String estatus;
	private String estatusPlaneacion;
	private String estatusSupervisor;

	private Integer anhioPlaneacion;
	
	private LocalDate fhRegistro;
	private LocalDate fhActualizacion;
	
}
